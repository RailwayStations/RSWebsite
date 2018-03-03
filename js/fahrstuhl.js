$(function () {
	'use strict';

    $(".fahrstuhl").on('click', function () {
				var detailTitleElement = $('#detail-title');
        var bahnhofName = detailTitleElement.html();
        var stationNr = detailTitleElement.attr('data-id');

		// curl -X GET --header "Accept: application/json" --header "Authorization: Bearer 2b344cb863ad6086779ba76dd628f9fd" "https://api.deutschebahn.com/fasta-beta/2.0/facilities"
		$.ajax({
			url: 'https://api.deutschebahn.com/fasta/v2/stations/' + stationNr,
			type: 'GET',
			dataType: 'json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer c88053dc72f037a5d56378a216c0fd76');
			},
			error: function () {
				console.log('loading fasta failed');
			},
			success: function (obj) {
				var jsonOutput = '';
				$.each(obj.facilities, function (key, value) {
					if (value.stationnumber == stationNr) {
						if (value.description) {
							jsonOutput = jsonOutput + "<p class='fahrstuhl'> " + value.description + "<br /> Status: <strong>" + value.state + "</strong></p>";
						} else {
							jsonOutput = jsonOutput + "<p class='fahrstuhl'> Status: <strong>" + value.state + "</strong></p>";
						}
					}

					swal({
						title: "<h4 class='h4fahrstuhl'>Fahrstuhlstatus</h4>" + bahnhofName,
						text: jsonOutput,
						confirmButtonColor: "#9f0c35",
						html: true
					});
				});

				if (!jsonOutput) {
					swal({
						title: "<h4 class='h4fahrstuhl'>Fahrstuhlstatus</h4>",
						text: "<p class='fahrstuhl'>F&uuml;r diesen Bahnhof sind leider noch keine Aufzugsdaten vorhanden</p>",
						confirmButtonColor: "#9f0c35",
						html: true
					});
				}
			}
		});
});

		$(".rolltreppen").on('click',function() {
					var detailTitleElement = $('#detail-title');
	        var bahnhofName = detailTitleElement.html();
	        var stationNr = detailTitleElement.attr('data-id');

		        $.ajax({
		            url: 'https://api.deutschebahn.com/fasta/v2/stations/' + stationNr,
		            type: 'GET',
		            dataType: 'json',
		            beforeSend: function (xhr) {
		                xhr.setRequestHeader('Authorization', 'Bearer c88053dc72f037a5d56378a216c0fd76');
		            },
		            error: function () {
		                console.log('loading fasta failed');
		            },
		            success: function (obj) {
		                var jsonOutput = '';
		                $.each(obj.facilities, function (key, value) {
		                    if (value.stationnumber == stationNr && value.type == "ESCALATOR") {
		                        if (value.description) {
		                            jsonOutput = jsonOutput + "<p class='fahrstuhl'> " + value.description + "<br /> Status: <strong>" + value.state + "</strong></p>";
		                        } else {
		                            jsonOutput = jsonOutput + "<p class='fahrstuhl'> Status: <strong>" + value.state + "</strong></p>";
		                        }
		                    }

		                    swal({
		                        title: "<h4 class='h4fahrstuhl'>Rolltreppenstatus</h4>" + bahnhofName,
		                        text: jsonOutput,
		                        confirmButtonColor: "#9f0c35",
		                        html: true
		                    });
		                });

		                if (!jsonOutput) {
		                    swal({
		                        title: "<h4 class='h4fahrstuhl'>Rolltreppenstatus</h4>",
		                        text: "<p class='fahrstuhl'>F&uuml;r diesen Bahnhof sind leider noch keine Rolltreppendaten vorhanden</p>",
		                        confirmButtonColor: "#9f0c35",
		                        html: true
		                    });
		                }
		            }
		        });
		});

});
