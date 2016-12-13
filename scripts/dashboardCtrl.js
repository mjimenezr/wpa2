angular.module('wpa2').controller("DashboardController", function ($scope) {


    var mbTot = 4096;
    var mbCons = parseInt(mbTot * Math.random());
    var mbRem = mbTot - mbCons;

    $scope.options = {
        title: {
            enable: true,
            text: "Megas consumidos"
        },
        subtitle: {
            enable: true,
            text: "sobre " + mbTot + " megas",
            css: {
                'font-size': '90%',
                'text-align': 'center',
                'margin': '10px 13px 0px 7px'
            }
        },
        chart: {
            type: 'pieChart',
            height: 450,
            donut: true,
            x: function (d) { return d.key; },
            y: function (d) { return d.y; },
            showLabels: false,
            showValues: true,
            color: ['red', '#f8e2ba'],

            pie: {
                startAngle: function (d) { return d.startAngle - Math.PI / 2 },
                endAngle: function (d) { return d.endAngle - Math.PI / 2 }
            },
            duration: 500,
            legend: {
                margin: {
                    top: 5,
                    right: 0,
                    bottom: 5,
                    left: 30
                }
            }
        }
    };


    $scope.data = [
                {
                    startAngle: 45,
                    key: "Consumido (" + mbCons + " Mb.)",
                    y: mbCons
                },
                {
                    key: "Pendiente (" + mbRem  +" Mb.)",
                    y: mbRem
                }
    ];


})