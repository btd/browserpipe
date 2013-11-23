
module.exports =
{
    reporter: function (results, data, opts)
    {
        "use strict";

        var files = {},
            out = [],
            pairs = {
                "&": "&amp;",
                '"': "&quot;",
                "'": "&apos;",
                "<": "&lt;",
                ">": "&gt;"
            },
            fileName, i, issue, errorMessage, globals, unuseds;

        opts = opts || {};

        function encode(s) {
            for (var r in pairs) {
                if (typeof(s) !== "undefined") {
                    s = s.replace(new RegExp(r, "g"), pairs[r]);
                }
            }
            return s || "";
        }

        //console.log(arguments)

        results.forEach(function (result) {

            // Register the file
            result.file = result.file.replace(/^\.\//, '');
            if (!files[result.file]) {
                files[result.file] = [];
            }

            // Create the error message
            errorMessage = result.error.reason;
            if (opts.verbose) {
                errorMessage += ' (' + result.error.code + ')';
            }

            // Add the error
            files[result.file].push({
                severity: 'error',
                line: result.error.line,
                column: result.error.character,
                message: errorMessage,
                source: 'jshint.' + result.error.code
            });
        });

        data.forEach(function (data) {
            globals = data.implieds;
            unuseds = data.unused;

            if(globals || unuseds) {
                // Register the file
                data.file = data.file.replace(/^\.\//, '');
                if (!files[data.file]) {
                    files[data.file] = [];
                }
            }


            if (globals) {
                globals.forEach(function (global) {
                    global.line.forEach(function(line) {
                        files[data.file].push({
                            severity: 'warning',
                            line: line,
                            column: 0,
                            message: 'Implied globals: ' + global.name,
                            source: 'jshint.global'
                        });
                    });
                });
            }
            if (unuseds) {
                unuseds.forEach(function (unused) {
                    files[data.file].push({
                        severity: 'warning',
                        line: unused.line,
                        column: 0,
                        message: 'Unused Variable: ' + unused.name,
                        source: 'jshint.unused'
                    });
                });
            }
        });


        out.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        out.push("<checkstyle version=\"4.3\">");

        for (fileName in files) {
            if (files.hasOwnProperty(fileName)) {
                out.push("\t<file name=\"" + fileName + "\">");
                for (i = 0; i < files[fileName].length; i++) {
                    issue = files[fileName][i];
                    out.push(
                        "\t\t<error " +
                            "line=\"" + issue.line + "\" " +
                            "column=\"" + issue.column + "\" " +
                            "severity=\"" + issue.severity + "\" " +
                            "message=\"" + encode(issue.message) + "\" " +
                            "source=\"" + encode(issue.source) + "\" " +
                            "/>"
                    );
                }
                out.push("\t</file>");
            }
        }

        out.push("</checkstyle>");

        process.stdout.write(out.join("\n") + "\n");
    }
};
