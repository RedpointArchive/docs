if (localStorage.savedApiKey != null) {
    $('*[data-apikey="true"]').val(localStorage.savedApiKey);
}

$('*[data-apikey="true"]').keyup(function(e) {
    var allApiKeyFields = $('*[data-apikey="true"]');
    allApiKeyFields.each(function(eli, el) {
        if (el.id != e.target.id) {
            $(el).val($(e.target).val())
        }
    });
    localStorage.savedApiKey = $(e.target).val();
});

$('*[data-remember="true"]').each(function(eli, el) {
    if (localStorage["field_" + el.id] != undefined) {
        $(el).val(localStorage["field_" + el.id]);
    }
})

$('*[data-remember="true"]').keyup(function(e) {
    $('*[data-remember="true"]').each(function(eli, el) {
        localStorage["field_" + el.id] = $(el).val();
    });
});

$('ul.collapse').on('hide.bs.collapse', function(e) {
    $(this).parent().first().find("a [data-fa-i2svg]").first()
        .removeClass('fa-angle-down')
        .addClass('fa-angle-right');
    e.stopPropagation();
});

$('ul.collapse').on('show.bs.collapse', function(e) {
    $(this).parent().first().find("a [data-fa-i2svg]").first()
        .addClass('fa-angle-down')
        .removeClass('fa-angle-right');
    e.stopPropagation();
});

$('*[data-tryit="true"]').on('submit', function(e) {
    e.preventDefault();

    var resultTarget = $("#" + e.target.id + "-result");
    var normalizedMethodName = e.target.id.substr(0, e.target.id.length - "-tryit".length);

    $("#" + normalizedMethodName + "submit").attr('disabled', 'disabled');
    $("#" + normalizedMethodName + "submit").html('<i class="fa fa-spinner fa-spin"></i> Executing...');

    try {
        resultTarget.find(".tryit-command").empty();
        resultTarget.find(".tryit-command").append($('<p></p>').text('Command-line equivalent:'));

        var apiKeyField = $("#" + normalizedMethodName + "api_key");
        var apiKey = '';
        if (apiKeyField.val() == '') {
            apiKey = 'X-API-Key;'; 
        } else {
            apiKey = 'X-API-Key: ' + apiKeyField.val().replace(/'/g, '\'"\'"\'');
        }

        var method = $("#" + normalizedMethodName + "method").val().toUpperCase();
        var url = $("#" + normalizedMethodName + "url").val();
        var fields = $("#" + normalizedMethodName + "fields").val();
        var reqFields = $("#" + normalizedMethodName + "reqFields").val().split(',');
        var bodyField = $("#" + normalizedMethodName + "bodyField").val();

        if (fields == '') {
            fields = [];
        } else {
            fields = fields.split(',');
        }

        var queryString = '';
        if (fields.length != 0) {
            for (var i = 0; i < fields.length; i++) {
                var fieldField = $("#" + normalizedMethodName + "field_" + fields[i]);
                if (fieldField.val() != '' || reqFields.indexOf(fields[i]) != -1) {
                    if (queryString == '') {
                        queryString = '?';
                    } else {
                        queryString += '&';
                    }
                    queryString += fields[i];
                    queryString += '=';
                    queryString += encodeURIComponent(fieldField.val());
                }
            }
        }
        
        var data = null;
        var dataLength = 0;
        var commandData = '';
        if (bodyField != '') {
            data = $("#" + normalizedMethodName + "field_" + bodyField).val();
            dataLength = data.length;
            commandData = "--data @fileWithData \\\n  ";
        }

        var command = "curl \\\n  -H '" + apiKey + "' \\\n  -H 'Content-Length: " + dataLength + "' \\\n  -X '" + method + "' \\\n  " + commandData + "'" + url + queryString.replace(/'/g, '\'"\'"\'') + "'";

        var commandHtml = Prism.highlight(command, Prism.languages.bash);

        var code = $('<code></code>').html(commandHtml);
        code.addClass('language-bash');

        resultTarget.find(".tryit-command").append($('<pre></pre>').addClass('language-bash').append(code));
        resultTarget.find(".tryit-results").empty();
        resultTarget.find(".tryit-results").append(
            $('<p></p>')
                .append($('<i></i>').addClass('fa fa-spinner fa-spin'))
                .append($('<strong></strong>').attr('style', 'margin-left: .5em;').text('Fetching result...'))
        );

        resultTarget.show();

        $.ajax(url + queryString, {
            headers: {
                api_key: apiKeyField.val()
            },
            method: method,
            data: data,
            dataType: 'text',
            success: function(data, textStatus, xhr) {
                resultTarget.find(".tryit-results").empty();
                resultTarget.find(".tryit-results").append(
                    $('<p></p>')
                        .append($('<i></i>').addClass('fa fa-check text-success'))
                        .append($('<strong></strong>').addClass('text-success').attr('style', 'margin-left: .5em;').text('Operation succeeded'))
                );
                var resultJson = null;
                try {
                    resultJson = $('<code></code>').html(Prism.highlight(data, Prism.languages.json));
                } catch (ex) {
                    resultJson = $('<code></code>').text(data);
                }
                resultJson.addClass('language-json');
                resultTarget.find(".tryit-results").append($('<pre></pre>').addClass('language-json').append(resultJson));
            },
            error: function(xhr, textStatus, errorThrown) {
                resultTarget.find(".tryit-results").empty();
                resultTarget.find(".tryit-results").append(
                    $('<p></p>')
                        .append($('<i></i>').addClass('fa fa-times text-danger'))
                        .append($('<strong></strong>').addClass('text-danger').attr('style', 'margin-left: .5em;').text('Operation failed'))
                );
                var resultText = null;
                if (xhr.responseText === undefined || xhr.responseText.trim() == '') {
                    resultText = $('<code></code>').text('No response received from server');
                } else {
                    try {
                        resultText = $('<code></code>').html(Prism.highlight(xhr.responseText, Prism.languages.json));
                    } catch (ex) {
                        resultText = $('<code></code>').text(xhr.responseText);
                    }
                }
                resultText.addClass('language-text');
                resultTarget.find(".tryit-results").append($('<pre></pre>').addClass('language-text').append(resultText));
            },
            complete: function() {
                $("#" + normalizedMethodName + "submit").removeAttr('disabled');
                $("#" + normalizedMethodName + "submit").html('Execute');
            }
        });
    } catch (ex) {
        $("#" + normalizedMethodName + "submit").removeAttr('disabled');
        $("#" + normalizedMethodName + "submit").html('Execute');
        resultTarget.find(".tryit-results").empty();
        resultTarget.find(".tryit-results").append(
            $('<p></p>')
                .append($('<i></i>').addClass('fa fa-times text-danger'))
                .append($('<strong></strong>').addClass('text-danger').attr('style', 'margin-left: .5em;').text('Operation failed'))
        );
        var resultText = $('<code></code>').text(ex.toString());
        resultText.addClass('language-text');
        resultTarget.find(".tryit-results").append($('<pre></pre>').addClass('language-text').append(resultText));
    }
});