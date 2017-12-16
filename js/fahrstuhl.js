$(function () {
	'use strict';

    $(".fahrstuhl").on('click', function () {
		var vars = [],
            hash,
			i,
            q = document.URL.split('?')[1];

        if (q !== undefined) {
            q = q.split('&');

            for (i = 0; i < q.length; i++) {
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }

        var bahnhofName = document.getElementById('bahnhofsname').innerHTML;
        var stationNr = vars.bahnhofNr;
        var n = stationNr.search('#');

        if (n !== -1) {
            stationNr = stationNr.substr(0, stationNr.length - 1);
        }

		// curl -X GET --header "Accept: application/json" --header "Authorization: Bearer 2b344cb863ad6086779ba76dd628f9fd" "https://api.deutschebahn.com/fasta-beta/2.0/facilities"
		$.ajax({
			url: 'https://api.deutschebahn.com/fasta-beta/2.0/stations/' + stationNr,
			type: 'GET',
			dataType: 'json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer 2b344cb863ad6086779ba76dd628f9fd');
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

$(".parkplaetze").on('click',function() {

    var vars = [],

            hash;

        var q = document.URL.split('?')[1];

        if (q != undefined) {

            q = q.split('&');

            for (var i = 0; i < q.length; i++) {

                hash = q[i].split('=');

                vars.push(hash[1]);

                vars[hash[0]] = hash[1];

            }

        }

        /* alert(vars['bahnhofNr']); */
        
        var bahnhofName = document.getElementById('bahnhofsname').innerHTML;

        var stationNr = vars['bahnhofNr'];

        var n = stationNr.search('#');

        /*alert(n);*/



        if (n != -1) {

            stationNr = stationNr.substr(0, stationNr.length - 1);

        }


/*
jQuery.get('parkraum-id-bahnhof.txt', function(daata) {
    alert(daata);
    });
*/
/*
BahnhofNr ParkraumId Bahnhof
187 350 Aschaffenburg Hbf
530 288;289 Berlin Ostbahnhof
4859 25 Berlin Südkreuz
767 28 Bonn Hbf
835 29 Braunschweig Hbf
855 31 Bremen Hbf
1374 390 Duisburg Hbf
1401 46 Düsseldorf Hbf
1690 50 Essen Hbf
1866 56;57;58 Frankfurt (Main) Hbf  
1893 61 Freiburg (Breisgau) Hbf
2120 361 Giessen
2498 79 Halle Charlottencenter
2514 367 Hamburg Hbf 
2545 87 Hannover
2648 95 Heilbronn Hbf
3082 103 Kaiserslautern Hbf 
3127 111;323 Kassel-Wilhelmshöhe  
3881 121;122;400 Magdeburg Hbf
4234 298 München Hbf
3898 440;441 Mainz Hbf
4872 378 Passau Hbf
5169 333 Regensburg Hbf 
6071 227;349 Stuttgart Hbf Parkraum 
6323 199 Ulm Hbf
6859 345;352 Wolfsburg Hbf
*/

var myjson = '{"187":{"id" : "350","name" : "Aschaffenburg Hbf"},"530":{"id" : "288;289","name" : "Berlin Ostbahnhof"},"4859":{"id" : "25","name" : "Berlin Südkreuz"},"767":{"id" : "28","name" : "Bonn Hbf"}, "835":{"id" : "29","name" : "Braunschweig Hbf"}, "855":{"id" : "31","name" : "Bremen Hbf"}, "1374":{"id" : "390","name" : "Duisburg Hbf"}, "1401":{"id" : "46","name" : "Düsseldorf Hbf"}, "1690":{"id" : "50","name" : "Essen Hbf"}, "1866":{"id" : "56;57;58","name" : "Frankfurt (Main) Hbf"}, "1893":{"id" : "61","name" : "Freiburg (Breisgau) Hbf"}, "2120":{"id" : "361","name" : "Giessen"}, "2498":{"id" : "79","name" : "Halle Charlottencenter"}, "2514":{"id" : "367","name" : "Hamburg Hbf"}, "2545":{"id" : "87","name" : "Hannover"}, "2648":{"id" : "95","name" : "Heilbronn Hbf"}, "3082":{"id" : "103","name" : "Kaiserslautern Hbf "}, "3127":{"id" : "111;323","name" : "Kassel-Wilhelmshöhe"}, "3881":{"id" : "121;122;400","name" : "Magdeburg Hbf"}, "4234":{"id" : "298","name" : "München Hbf"}, "3898":{"id" : "440;441","name" : "Mainz Hbf"}, "4872":{"id" : "378","name" : "Passau Hbf"}, "5169 ":{"id" : "333","name" : "Regensburg Hbf"}, "6071 ":{"id" : "227;349","name" : "Stuttgart Hbf Parkraum"},  "6323 ":{"id" : "199","name" : "Ulm Hbf"}, "6859 ":{"id" : "345;352","name" : "Wolfsburg Hbf"}}';

/*
var myjson ='{"187":{"id" : "350","name" : "Aschaffenburg Hbf"},"530":{"id" : "288;289","name" : "Berlin Ostbahnhof"},"4859":{"id" : "25","name" : "Berlin Südkreuz"},"767":{"id" : "28","name" : "Bonn Hbf"}}';
*/
var newJ = $.parseJSON(myjson);

/* alert(stationNr); */
if (newJ[stationNr] == undefined) { 
    

                swal({

                    title: "<h4 class='h4fahrstuhl'>Parkplatzstatus</h4>",

                    text: "<p class='fahrstuhl'>Derzeit liegen noch keine Daten vor.</p>",

                    confirmButtonColor: "#9f0c35",

                    html: true

                });



} else { 

    var pid = newJ[stationNr].id;

    /* alert(pid); */


    $.getJSON('http://opendata.dbbahnpark.info/api/beta/occupancy/' + pid, function(obj) {

            var jsonOutput = '';
            var siteName = obj.site.siteName;
            var displayName = obj.site.displayName;

            var occupancy = obj.allocation.text;
            var validData = obj.allocation.validData;

    if (!validData) {   
        swal({
            title: "<h4 class='h4fahrstuhl'>Parkplatzstatus</h4>",

                    text: "<p class='fahrstuhl'>Leider keine valide Daten vorhanden.</p>",

                    confirmButtonColor: "#9f0c35",

                    html: true

        });
    }    

    if (validData) {

            //alert("Parkplätze: " + siteName + " " + occupancy);


             swal({

                    title: "<h4 class='h4fahrstuhl'>Parkplatzstatus</h4>" + siteName,

                    text: "<p class='fahrstuhl'>" + displayName + " hat " + occupancy + " Parkplätze.</p>",

                    confirmButtonColor: "#9f0c35",

                    html: true

                });
          }     



});

}

});
});
