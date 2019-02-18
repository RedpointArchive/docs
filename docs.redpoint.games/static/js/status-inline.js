function applyLevel(worstLevel) {
  $("#status-inline").html('');
  $('#partial-outage-notice').hide();
  $('#major-outage-notice').hide();

  if (worstLevel == 1) {
    $("#status-inline").append($("<span></span>").attr('class', 'badge badge-success').text('Operational'));
  } else if (worstLevel == 2) { 
    $("#status-inline").append($("<span></span>").attr('class', 'badge badge-info').text('Performance Issues'));
  } else if (worstLevel == 3) { 
    $("#status-inline").append($("<span></span>").attr('class', 'badge badge-warning').text('Partial Outage'));
    $('#partial-outage-notice').show();
  } else if (worstLevel == 4) {
    $("#status-inline").append($("<span></span>").attr('class', 'badge badge-danger').text('Major Outage'));
    $('#major-outage-notice').show();
  }
}

$(function() {
  var worstLevel = 1;
  $.get("https://status.redpoint.games/api/v1/services/all", function(data, textStatus, jqXHR) {
    for (var i = 0; i < data.data.length; i++) {
      if (data.data[i].permalink.indexOf("hivemp") === 0) {
        if (data.data[i].status.id > worstLevel) {
          worstLevel = data.data[i].status.id;
          break;
        }
      }
    }

    applyLevel(worstLevel);
    if (window.localStorage) {
      window.localStorage.setItem("worstLevel", worstLevel);
    }
  }, 'json');
})