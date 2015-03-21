'use strict';

angular.module('datafestApp')
    .factory('chart', function(MainMap) {

        var _chart = {};

        var temp_gradient;
        var distance;
        var start;
        var end;
        var rightclicklatlng;
        var gradient_orange;
        var gradient_red;
        var disone;
        var distwo;
        var disthree;
        var disfour;
        var gradeone;
        var gradetwo;
        var gradethree;
        var gradefour;
        var disabled;
        var hideminmax;
        var mode;
        var address;
        var inverse;
        var system_mi = 1;
        var system_ft = 1;
        var str_mi = "km";
        var str_ft = "m";
        var chartleft;
        var chartright;
        var chartheight;
        var chartwidth;
        var charttop;
        var fullsize;
        var elevations = [];
        var elevation_status;

        _chart.elevator = null;

        _chart.chart = null;

        _chart.drawPath = function(path) {

            var pathRequest = {
                'path': path,
                'samples': 512
            }

            // Initiate the path request.
            _chart.elevator.getElevationAlongPath(pathRequest, plotElevation);
        }

        // Takes an array of ElevationResult objects, draws the path on the map
        // and plots the elevation profile on a Visualization API ColumnChart.
        function plotElevation(results, status) {
            if (status != google.maps.ElevationStatus.OK) {
                return;
            }
            elevations = results;
            elevation_status = status;

            // Extract the elevation samples from the returned results
            // and store them in an array of LatLngs.
            var elevationPath = [];
            for (var i = 0; i < results.length; i++) {
                elevationPath.push(elevations[i].location);
            }

            var new_distance = MainMap.objects.directionsDisplay.getDirections().routes[0].legs[0].distance.value;

            // Extract the data from which to populate the chart.
            // Because the samples are equidistant, the 'Sample'
            // column here does double duty as distance along the
            // X axis.
            var data = new google.visualization.DataTable();
            distance = 0;
            var distances = [];
            var altitudes = [];
            var differenceup = 0;
            var differencedown = 0;
            var cat_one = [];
            var cat_two = [];
            var cat_three = [];
            var cat_four = [];
            var max = 0;
            var min = 10000;
            var maxindex = 0;
            var minindex = 0;
            var temp_distance;
            var temp_elevation;
            var tempup = 0;
            var tempdown = 0;
            var gradient = 0;
            var count = 0;
            var gradientred = [];
            var gradientorange = [];
            var lastcolor;
            var gradients = [];
            var anno = '';
            var poly_distance = 0;


            data.addColumn('string', '');
            data.addColumn('number', 'Elevation');
            data.addColumn({
                'type': 'string',
                'role': 'tooltip'
            });
            data.addColumn({
                type: 'string',
                role: 'annotation'
            });
            data.addColumn('number', 'Gradient');
            data.addColumn({
                'type': 'string',
                'role': 'tooltip'
            });
            data.addColumn({
                type: 'string',
                role: 'annotation'
            });
            data.addColumn('number', 'Gradient');
            data.addColumn({
                'type': 'string',
                'role': 'tooltip'
            });
            data.addColumn({
                type: 'string',
                role: 'annotation'
            });


            for (var i = 0; i < results.length; i++) {
                altitudes[i] = elevations[i].elevation;
                if (elevations[i].elevation < min) {
                    min = elevations[i].elevation;
                    minindex = i;
                }
                if (elevations[i].elevation > max) {
                    max = elevations[i].elevation;
                    maxindex = i;
                }
                if (i < results.length - 1) {
                    distances[i] = google.maps.geometry.spherical.computeDistanceBetween(elevations[i].location, elevations[i + 1].location);
                    distance = distance + distances[i];
                    gradients[i] = (elevations[i + 1].elevation - elevations[i].elevation) / distances[i];

                    if (distance > 100) {
                        gradient = (elevations[i + 1].elevation - elevations[i - count].elevation) / distance;
                        if (gradient > gradient_red) {
                            for (var x = i - count; x <= i + 1; x++) {
                                gradientred[x] = true;
                                gradientorange[x] = false;

                            }

                        }
                        if (gradient > gradient_orange) {
                            for (var x = i - count; x <= i + 1; x++) {
                                gradientorange[x] = true;
                            }
                        }

                        distance = distance - distances[i - count];
                        count--;
                    }
                    count++;
                    poly_distance = poly_distance + distances[i];
                }

            }
            var distance_ratio = new_distance / poly_distance;
            var distance_temp = 0;
            distance = 0;
            gradient = 0;
            lastcolor = "blue";
            temp_gradient = gradients[0];
            var temptops = findtemptops(gradients);
            cat_one = findtops(temptops, gradients, distances, altitudes, disone, disone * 1.5, gradeone);
            cat_two = findtops(temptops, gradients, distances, altitudes, distwo, disone, gradetwo);
            cat_three = findtops(temptops, gradients, distances, altitudes, disthree, distwo, gradethree);
            cat_four = findtops(temptops, gradients, distances, altitudes, disfour, disthree, gradefour);
            clearcats(cat_one, disone, cat_two, distwo, cat_three, disthree, cat_four, disfour, distances);



            for (var i = 0; i < results.length; i++) {
                temp_distance = rounder(distance / 1000);
                temp_elevation = rounder(elevations[i].elevation * system_ft);
                if (i > 0) {
                    temp_gradient = rounder((gradients[i] + gradients[i - 1]) * 50);
                }
                anno = '';
                if (i == minindex && !hideminmax) {
                    anno = 'MIN';
                }
                if (i == maxindex && !hideminmax) {
                    anno = 'MAX';
                }
                if (cat_one[i]) {
                    anno = '1';
                } else if (cat_two[i]) {
                    anno = '2';
                } else if (cat_three[i]) {
                    anno = '3';
                } else if (cat_four[i]) {
                    anno = '4';
                }

                if (i < results.length - 2) {

                    if (gradientorange[i] && gradientorange[i + 2]) {
                        gradientorange[i + 1] = true;

                    }
                    if (!gradientorange[i] && !gradientorange[i + 2]) {
                        gradientorange[i + 1] = false;

                    }
                    if (gradientred[i] && gradientred[i + 2]) {
                        gradientred[i + 1] = true;
                    }

                }


                if (gradientred[i]) {

                    if (lastcolor == "orange") {
                        data.addRow(['' + Math.round(distance / 1000), , tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno]);
                    } else if (lastcolor == "blue") {
                        data.addRow(['' + Math.round(distance / 1000), temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, , tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno]);
                    } else {
                        data.addRow(['' + Math.round(distance / 1000), , tooltip(temp_distance, temp_elevation, temp_gradient), anno, , tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno]);
                    }
                    lastcolor = "red";
                } else if (gradientorange[i]) {

                    if (lastcolor == "orange") {
                        data.addRow(['' + Math.round(distance / 1000), , tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, , tooltip(temp_distance, temp_elevation, temp_gradient), anno]);
                    } else if (lastcolor == "blue") {
                        data.addRow(['' + Math.round(distance / 1000), temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, , tooltip(temp_distance, temp_elevation, temp_gradient), anno]);
                    } else if (lastcolor = "red") {
                        data.addRow(['' + Math.round(distance / 1000), , tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno]);
                    }
                    lastcolor = "orange";
                } else {
                    if (lastcolor == "orange") {
                        data.addRow(['' + Math.round(distance / 1000), temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, , tooltip(temp_distance, temp_elevation, temp_gradient), anno]);
                    } else if (lastcolor == "blue") {
                        data.addRow(['' + Math.round(distance / 1000), temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, , tooltip(temp_distance, temp_elevation, temp_gradient), anno, , tooltip(temp_distance, temp_elevation, temp_gradient), anno]);
                    } else {
                        data.addRow(['' + Math.round(distance / 1000), temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno, , tooltip(temp_distance, temp_elevation, temp_gradient), anno, temp_elevation, tooltip(temp_distance, temp_elevation, temp_gradient), anno]);
                    }
                    lastcolor = "blue";
                }



                if (i < results.length - 1) {
                    distance_temp = distance_temp + distances[i];
                    distance = distance_temp * distance_ratio * system_mi;
                    if (elevations[i].elevation > elevations[i + 1].elevation) {
                        differencedown = differencedown + elevations[i].elevation - elevations[i + 1].elevation;
                    } else {
                        differenceup = differenceup + elevations[i + 1].elevation - elevations[i].elevation;
                    }

                }
            }

            new_distance = rounder(new_distance * system_mi / 1000);
            differenceup = rounder(differenceup * system_ft);
            differencedown = rounder(differencedown * system_ft);
            max = rounder(max * system_ft);
            min = rounder(min * system_ft);
            


            // Draw the chart using the data within its DIV.
            document.getElementById('elevation_chart').style.display = 'block';

            _chart.chart.draw(data, {
                vAxis: {
                    title: 'Elevation (' + str_ft + ')'
                },
                hAxis: {
                    title: 'Distance (' + str_mi + ')',
                    showTextEvery: 20,
                    maxAlternation: 100,
                    slantedText: 'false'
                },
                legend: {
                    position: 'none'
                },
                backgroundColor: '#f2f2f2',
                animation: {
                    duration: 1000,
                    easing: 'linear'
                },
                bar: {
                    groupWidth: '100%'
                },
                chartArea: {
                    left: chartleft,
                    right: chartright,
                    top: charttop,
                    width: chartwidth,
                    height: chartheight
                },
                axisTitlesPosition: "in",
                isHtml: true,
                lineWidth: 3,
                areaOpacity: 0.4,
                colors: ['#295DBC', '#F29D00', '#ED0300'],

            });

        }

        function findtemptops(gradients) {

            var count = 0;
            var temp = false;
            var temptops = [];

            for (var i = 0; i < gradients.length; i++) {
                if (gradients[i] > 0) {
                    count = 0;
                    temp = true;
                } else if (temp) {
                    count++;
                    temptops[i] = true;
                    temp = false;
                    count = 0;
                }
            }
            temptops[gradients.length - 1] = true;
            return temptops;
        }

        function findtops(temptops, gradients, distances, altitudes, length, length_stop, avggrade) {

            var intervall_start = 0;
            var tempdistance = 0;
            var tempgradient = 0;
            var tops = [];
            for (var i = 0; i < distances.length; i++) {
                if (temptops[i]) {
                    tempdistance = 0;
                    tempgradient = 0;
                    for (var z = i - 1; z >= 0; z--) {
                        tempdistance = tempdistance + distances[z];
                        if (tempdistance > length && tempdistance < length_stop) {
                            tempgradient = (altitudes[i] - altitudes[z]) / tempdistance;
                            if (tempgradient > avggrade) {

                                intervall_start = z;

                                tops[i] = true;
                            }
                        }

                    }
                    if (tops[i]) {
                        for (var x = intervall_start; x < i; x++) {
                            if (altitudes[x] > altitudes[i] && temptops[x]) {
                                tops[i] = false;
                            }
                            if (altitudes[x] < altitudes[i] && temptops[x]) {
                                tops[x] = false;
                            }
                        }
                    }

                }

            }

            return tops;
        }

        function clearcats(one, disone, two, distwo, three, disthree, four, disfour, distances) {
            var z;
            var tempdistance;
            for (var i = 0; i < distances.length; i++) {
                if (one[i]) {
                    z = i - 1;
                    tempdistance = 0;
                    while (tempdistance <= disone * 1.5) {
                        tempdistance = tempdistance + distances[z];
                        two[z] = false;
                        three[z] = false;
                        four[z] = false;
                        z--;
                    }
                }
                if (two[i]) {
                    z = i - 1;
                    tempdistance = 0;
                    while (tempdistance <= disone) {
                        if (one[z]) {
                            two[i] = false;
                        }
                        tempdistance = tempdistance + distances[z];
                        three[z] = false;
                        four[z] = false;
                        z--;
                    }
                }
                if (three[i]) {
                    z = i - 1;
                    tempdistance = 0;
                    while (tempdistance <= distwo) {
                        if (one[z] || two[z]) {
                            three[i] = false;
                        }
                        tempdistance = tempdistance + distances[z];
                        four[z] = false;
                        z--;
                    }
                }
                if (four[i]) {
                    z = i - 1;
                    tempdistance = 0;
                    while (tempdistance <= disthree) {
                        if (one[z] || two[z] || three[z]) {
                            four[i] = false;
                        }
                        tempdistance = tempdistance + distances[z];
                        z--;
                    }
                }
                if (disone == 0) {
                    one[i] = false;
                    two[i] = false;
                    three[i] = false;
                    four[i] = false;
                }

            }
        }


        function tooltip(temp_distance, temp_elevation, temp_gradient) {
            return 'Distance: ' + temp_distance + ' ' + str_mi + '\nElevation: ' + temp_elevation + ' ' + str_ft;
        }

        function barMouseOver(e) {
            chart.setSelection([e]);
        }

        function barMouseOut(e) {
            chart.setSelection([{
                'row': null,
                'column': null
            }]);
        }

        function rounder(number) {

            return Math.round(number * 100) / 100;
        }

        return _chart;
    });
