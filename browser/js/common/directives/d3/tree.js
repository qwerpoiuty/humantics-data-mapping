app.directive("d3", function(dataFactory, reportingFactory) {
        return {
            restrict: 'E',
            scope: {
                root: "="
            },
            templateUrl: 'js/common/directives/d3/tree.html',
            link: function(scope) {
                console.log(scope.root)
                var margin = {
                        top: 10,
                        right: 200,
                        bottom: 20,
                        left: 200
                    },
                    width = 1800 - margin.right - margin.left,
                    height = 900 - margin.top - margin.bottom;

                var i = 0,
                    duration = 750,
                    root;

                var tree = d3.layout.tree()
                    .size([height, width]);

                var diagonal = d3.svg.diagonal()
                    .projection(function(d) {
                        return [d.y, d.x];
                    });
                var svg = d3.select("d3").append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // root = scope.root[0];
                root = scope.root[0]
                root.x0 = height / 2;
                root.y0 = 0;



                function collapse(d) {
                    if (d.children) {
                        d._children = d.children;
                        d._children.forEach(collapse);
                        d.children = null;
                    }
                }

                root.children.forEach(collapse);
                update(root);
                d3.select(self.frameElement).style("height", "800px");

                function update(source) {
                    // Compute the new tree layout.
                    var nodes = tree.nodes(root).reverse(),
                        links = tree.links(nodes);

                    // Normalize for fixed-depth.
                    nodes.forEach(function(d) {
                        d.y = d.depth * 200;
                    });
                    // Update the nodes…
                    var node = svg.selectAll("g.node")
                        .data(nodes, function(d) {
                            return d.id || (d.id = ++i);
                        });

                    // Enter any new nodes at the parent's previous position.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) {
                            return "translate(" + source.y0 + "," + source.x0 + ")";
                        })
                        .on("click", click);

                    nodeEnter.append("circle")
                        .attr("r", 1e-6)
                        .style("fill", function(d) {
                            return d._children ? "lightsteelblue" : "#fff";
                        });

                    nodeEnter.append("text")
                        .attr("x", function(d) {
                            return d.children || d._children ? 10 : 10;
                        })
                        .attr("y", function(d) {
                            return d.children || d._children ? -12 : 10;
                        })
                        .attr("transform", "translate(0,0)")
                        .attr("dy", ".35em")
                        .attr("text-anchor", function(d) {
                            return d.children || d._children ? "end" : "start";
                        })
                        .text(function(d) {
                            return d.name;
                        })
                        .style("fill-opacity", 1e-6);

                    // Transition nodes to their new position.
                    var nodeUpdate = node.transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            return "translate(" + d.y + "," + d.x + ")";
                        });

                    nodeUpdate.select("circle")
                        .attr("r", 4.5)
                        .style("fill", function(d) {
                            return d._children ? "lightsteelblue" : "#fff";
                        });

                    nodeUpdate.select("text")
                        .style("fill-opacity", 1);

                    // Transition exiting nodes to the parent's new position.
                    var nodeExit = node.exit().transition()
                        .duration(duration)
                        .attr("transform", function(d) {
                            return "translate(" + source.y + "," + source.x + ")";
                        })
                        .remove();

                    nodeExit.select("circle")
                        .attr("r", 1e-6);

                    nodeExit.select("text")
                        .style("fill-opacity", 1e-6);

                    // Update the links…
                    var link = svg.selectAll("path.link")
                        .data(links, function(d) {
                            return d.target.id;
                        });

                    // Enter any new links at the parent's previous position.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", function(d) {
                            var o = {
                                x: source.x0,
                                y: source.y0
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        });

                    // Transition links to their new position.
                    link.transition()
                        .duration(duration)
                        .attr("d", diagonal);

                    // Transition exiting nodes to the parent's new position.
                    link.exit().transition()
                        .duration(duration)
                        .attr("d", function(d) {
                            var o = {
                                x: source.x,
                                y: source.y
                            };
                            return diagonal({
                                source: o,
                                target: o
                            });
                        })
                        .remove();

                    // Stash the old positions for transition.
                    nodes.forEach(function(d) {
                        d.x0 = d.x;
                        d.y0 = d.y;
                    });
                }

                // Toggle children on click.
                function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    update(d);
                }

            }

        }
    })
    // var flare = {
    //     "name": "flare",
    //     "children": [{
    //         "name": "analytics",
    //         "children": [{
    //             "name": "cluster",
    //             "children": [{
    //                 "name": "AgglomerativeCluster",
    //                 "size": 1
    //             }, {
    //                 "name": "CommunityStructure",
    //                 "size": 1
    //             }, {
    //                 "name": "HierarchicalCluster",
    //                 "size": 1
    //             }, {
    //                 "name": "MergeEdge",
    //                 "size": 1
    //             }]
    //         }, {
    //             "name": "graph",
    //             "children": [{
    //                 "name": "BetweennessCentrality",
    //                 "size": 1
    //             }, {
    //                 "name": "LinkDistance",
    //                 "size": 1
    //             }, {
    //                 "name": "MaxFlowMinCut",
    //                 "size": 1
    //             }, {
    //                 "name": "ShortestPaths",
    //                 "size": 1
    //             }, {
    //                 "name": "SpanningTree",
    //                 "size": 1
    //             }]
    //         }, {
    //             "name": "optimization",
    //             "children": [{
    //                 "name": "AspectRatioBanker",
    //                 "size": 1
    //             }]
    //         }]
    //     }, {
    //         "name": "scale",
    //         "children": [{
    //             "name": "IScaleMap",
    //             "size": 1
    //         }, {
    //             "name": "LinearScale",
    //             "size": 1
    //         }, {
    //             "name": "LogScale",
    //             "size": 1
    //         }, {
    //             "name": "OrdinalScale",
    //             "size": 1
    //         }, {
    //             "name": "QuantileScale",
    //             "size": 1
    //         }, {
    //             "name": "QuantitativeScale",
    //             "size": 1
    //         }, {
    //             "name": "RootScale",
    //             "size": 1
    //         }, {
    //             "name": "Scale",
    //             "size": 1
    //         }, {
    //             "name": "ScaleType",
    //             "size": 1
    //         }, {
    //             "name": "TimeScale",
    //             "size": 1
    //         }]
    //     }]
    // }