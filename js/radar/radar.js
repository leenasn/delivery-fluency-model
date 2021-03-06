/**
 * Created by Gary A. Stafford on 1/29/15.
 * https://github.com/garystafford/cd-maturity-model
 *
 * Source code based project by Nadieh Bremer:
 * http://www.visualcinnamon.com/2013/09/making-d3-radar-chart-look-bit-better.html
 * His source code comes from https://github.com/alangrafu/radar-chart-d3
 * For a bit of extra information check the blog about it:
 * http:nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html
 */

/*properties
 ExtraWidthX, ExtraWidthY, PI, ToRight, TranslateX, TranslateY, append, attr,
 axis, categories, color, colorScale, cos, data, draw, enter, factor,
 factorLegend, forEach, format, h, hasOwnProperty, length, levels, map, max,
 maxValue, min, on, opacityArea, push, radians, radius, remove, select,
 selectAll, sin, style, text, transformScaleReverse, transition, value, w
 */

/*global radarModule: true, Math, d3, dataModule, dataTransformModule, parseFloat */
/*jslint plusplus: true, unparam: true */
var radarModule = (function () {
    'use strict';

    return {
        draw: function (id, d, options) {
            var cfg,
                series,
                axis,
                allAxis,
                total,
                radius,
                levelFactor,
                format,
                g,
                tooltip,
                dataValues,
                i,
                j,
                pti,
                z,
                newX,
                newY;

            cfg = {
                radius      : 5,
                w           : 600,
                h           : 600,
                factor      : 1,
                factorLegend: 0.85,
                levels      : 3,
                maxValue    : 100,
                radians     : 2 * Math.PI,
                opacityArea : 0.5,
                ToRight     : 5,
                TranslateX  : 90,
                TranslateY  : 30,
                ExtraWidthX : 100,
                ExtraWidthY : 100,
                color       : dataModule.colorScale
            };

            if (options !== 'undefined') {
                for (i in options) {
                    if (options.hasOwnProperty(i)) {
                        if ('undefined' !== options[i]) {
                            cfg[i] = options[i];
                        }
                    }
                }
            }
            cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) {
                return d3.max(i.map(function (o) {
                    return o.value;
                }));
            }));

            if (d.length === 0) {
                return dataModule.categories[0];
            }
            allAxis = (d[0].map(function (i, j) {
                return i.axis;
            }));

            total = allAxis.length;
            radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
            format = d3.format('d');
            d3.select(id).select('svg').remove();

            g = d3.select(id)
                .append('svg')
                .attr('width', cfg.w + cfg.ExtraWidthX)
                .attr('height', cfg.h + cfg.ExtraWidthY)
                .append('g')
                .attr('transform', 'translate(' + cfg.TranslateX + ',' + cfg.TranslateY + ')');

            function calcX1(d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
            }

            function calcY1(d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
            }

            function calcX2(d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
            }

            function calcY2(d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
            }

            //Circular segments
            for (j = 0; j < cfg.levels; j++) {
                levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                g.selectAll('.levels')
                    .data(allAxis)
                    .enter()
                    .append('svg:line')
                    .attr('x1', calcX1)
                    .attr('y1', calcY1)
                    .attr('x2', calcX2)
                    .attr('y2', calcY2)
                    .attr('class', 'line')
                    .style('stroke', '#999999')
                    .style('stroke-opacity', '0.75')
                    .style('stroke-width', '.5px')
                    .attr('transform', 'translate(' + (cfg.w / 2 - levelFactor) + ', ' +
                        (cfg.h / 2 - levelFactor) + ')');
            }

            function calcX(d) {
                return levelFactor * (1 - cfg.factor * Math.sin(0));
            }

            function calcY(d) {
                return levelFactor * (1 - cfg.factor * Math.cos(0));
            }

            if (d[0].length > 0) { //If data was supplied
                //Text indicating at what % each level is
                for (j = 0; j < cfg.levels; j++) {
                    levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                    g.selectAll('.levels')
                        .data([1])
                        .enter()
                        .append('svg:text')
                        .attr('x', calcX)
                        .attr('y', calcY)
                        .attr('class', 'legend')
                        .style('font-family', 'sans-serif')
                        .style('font-size', '11px')
                        .attr('transform', 'translate(' + (cfg.w / 2 - levelFactor + cfg.ToRight) + ', ' +
                            (cfg.h / 2 - levelFactor) + ')')
                        .attr('fill', '#999999')
                        .text(format(dataTransformModule.transformScaleReverse(((j + 1) * cfg.maxValue / cfg.levels))));
                }

                series = 0;

                axis = g.selectAll('.axis')
                    .data(allAxis)
                    .enter()
                    .append('g')
                    .attr('class', 'axis');

                axis.append('line')
                    .attr('x1', cfg.w / 2)
                    .attr('y1', cfg.h / 2)
                    .attr('x2', function (d, i) {
                        return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                    })
                    .attr('y2', function (d, i) {
                        return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                    })
                    .attr('class', 'line')
                    .style('stroke', '#999999')
                    .style('stroke-width', '.75px');

                axis.append('text')
                    .attr('class', 'legend')
                    .text(function (d) {
                        return d;
                    })
                    .style('font-family', 'sans-serif')
                    .style('font-size', '11px')
                    .attr('text-anchor', 'middle')
                    .attr('dy', '1.5em')
                    .attr('transform', function (d, i) {
                        return 'translate(0, -10)';
                    })
                    .attr('x', function (d, i) {
                        return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) -
                            60 * Math.sin(i * cfg.radians / total);
                    })
                    .attr('y', function (d, i) {
                        return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) -
                            20 * Math.cos(i * cfg.radians / total);
                    });

                d.forEach(function (y, x) {
                    dataValues = [];
                    g.selectAll('.nodes')
                        .data(y, function (j, i) {
                            dataValues.push([
                                cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                                cfg.factor * Math.sin(i * cfg.radians / total)),
                                cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                                cfg.factor * Math.cos(i * cfg.radians / total))
                            ]);
                        });
                    dataValues.push(dataValues[0]);
                    g.selectAll('.area')
                        .data([dataValues])
                        .enter()
                        .append('polygon')
                        .attr('class', 'radar-chart-series' + series)
                        .style('stroke-width', '2px')
                        .style('stroke', cfg.color(series))
                        .attr('points', function (d) {
                            var str = '';
                            for (pti = 0; pti < d.length; pti++) {
                                str = str + d[pti][0] + ',' + d[pti][1] + ' ';
                            }
                            return str;
                        })
                        .style('fill', function (d, i) {
                            return cfg.color(series);
                        })
                        .style('fill-opacity', cfg.opacityArea)
                        .on('mouseover', function (d) {
                            z = 'polygon.' + d3.select(this).attr('class');
                            g.selectAll('polygon')
                                .transition(200)
                                .style('fill-opacity', 0.1);
                            g.selectAll(z)
                                .transition(200)
                                .style('fill-opacity', 0.7);
                        })
                        .on('mouseout', function () {
                            g.selectAll('polygon')
                                .transition(200)
                                .style('fill-opacity', cfg.opacityArea);
                        });
                    series++;
                });
                series = 0;

                d.forEach(function (y, x) {
                    g.selectAll('.nodes')
                        .data(y).enter()
                        .append('svg:circle')
                        .attr('class', 'radar-chart-series' + series)
                        .attr('r', cfg.radius)
                        .attr('alt', function (j) {
                            return Math.max(j.value, 0);
                        })
                        .attr('cx', function (j, i) {
                            dataValues.push([
                                cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                                cfg.factor * Math.sin(i * cfg.radians / total)),
                                cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                                cfg.factor * Math.cos(i * cfg.radians / total))
                            ]);
                            return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor *
                                Math.sin(i * cfg.radians / total));
                        })
                        .attr('cy', function (j, i) {
                            return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor *
                                Math.cos(i * cfg.radians / total));
                        })
                        .attr('data-id', function (j) {
                            return j.axis;
                        })
                        .style('fill', cfg.color(series)).style('fill-opacity', 0.9)
                        .on('mouseover', function (d) {
                            newX = parseFloat(d3.select(this).attr('cx')) - 10;
                            newY = parseFloat(d3.select(this).attr('cy')) - 5;

                            tooltip
                                .attr('x', newX)
                                .attr('y', newY)
                                .text(dataTransformModule.transformScaleReverse(d.value))
                                .transition(200)
                                .style('opacity', 1);

                            z = 'polygon.' + d3.select(this).attr('class');
                            g.selectAll('polygon')
                                .transition(200)
                                .style('fill-opacity', 0.1);
                            g.selectAll(z)
                                .transition(200)
                                .style('fill-opacity', 0.7);
                        })
                        .on('mouseout', function () {
                            tooltip
                                .transition(200)
                                .style('opacity', 0);
                            g.selectAll('polygon')
                                .transition(200)
                                .style('fill-opacity', cfg.opacityArea);
                        });

                    series++;
                });

                //Tooltip
                tooltip = g.append('text')
                    .style('opacity', 0)
                    .style('font-family', 'sans-serif')
                    .style('font-size', '13px');
            }
        }
    };
}());