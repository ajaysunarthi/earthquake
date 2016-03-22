(function() {
    'use strict';
    var element = d3.select("#earthquake");

    var margin = {
        top: 20,
        right: 20,
        bottom: 70,
        left: 50
    };


    var elementWidth = parseInt(element.style('width'), 10),
        elementHeight = parseInt(element.style('height'), 10),
        width = elementWidth - margin.left - margin.right,
        height = elementHeight - margin.top - margin.bottom;


    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.log()
        .range([height, 0]);


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y).tickFormat(function(d) {
            return y.tickFormat(10, d3.format(",d"))(d)
        })
        .orient("left");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong> Fatalities </strong> <span style = 'color:red'>"+ d.fatalities + "</span>";
        });

    var svg = element.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.tsv("data.tsv", type, function(error, data) {
        if (error) throw error;

        x.domain(data.map(function(d) {
            return d.year;
        }));
        y.domain([1, d3.max(data, function(d) {
            return d.fatalities;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append('text')
            .attr('dy', "2.3em")
            .attr('fill', "black")
            .style("font-size", "18px")
            .style("fontWeight", "600")
            .attr('dx', "6em")
            .text('year wise fatalities in log scale');

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".51em")
            .style("text-anchor", "end")
            .text("Fatalities");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return x(d.year);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d) {
                return y(d.fatalities);
            })
            .attr("height", function(d) {
                return height - y(d.fatalities);
            });

        svg.selectAll(".bar")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)


    });

    function type(d) {
        d.fatalities = +d.fatalities;
        return d;
    }


}());
