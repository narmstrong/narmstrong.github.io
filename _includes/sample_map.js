<script type="text/javascript">

            // Initialize global variables
            var svg_height = 300,
                svg_width = 500;

            // Initialize map projection for use by the path generator

            var projection = d3.geo.albersUsa()
                                     .translate([svg_width/2, svg_height/2]) // centers projection in SVG
                                     .scale([615]);

            // Initialize path generator for map construction
            var path = d3.geo.path()
                               .projection(projection);

            // Initialize color scale
            var color = d3.scale.quantize()
                                  .range(["rgb(237,248,233)",
                                          "rgb(186,228,179)",
                                          "rgb(116,196,118)",
                                          "rgb(49,163,84)",
                                          "rgb(0,109,44)"
                                         ]);

            // Initialize SVG environment
            var svg = d3.select("body")
                        .append("svg")
                          .attr({
                              "width" : svg_width,
                              "height" : svg_height
                          });

            // Load agricultural productivity data
            d3.csv("us-ag-productivity-2004.csv", function(data) {

                // Set color domain based on ag data
                color.domain([
                    d3.min(data, function(d){ return d.value; }),
                    d3.max(data, function(d){ return d.value; })
                ]);

                // Load GeoJSON polygon path data
                d3.json("us-states.json", function(json){

                    // Add ag data to GeoJSON data
                    for(var i = 0; i < data.length; i++) {
                        var stateName = data[i].state;
                        var dataVal = parseFloat(data[i].value);

                        for(var j = 0; j < json.features.length; j++) {
                            if(stateName == json.features[j].properties.name) {
                                json.features[j].properties.value = dataVal;
                                break;
                            }
                        }
                    }

                    // Define json dependent actions to execute in the callback
                    svg.selectAll("path")
                           .data(json.features)
                           .enter()
                         .append("path")
                           .attr("d", path)
                           .style("fill", function(d){
                               if(d.properties.value)
                                   return color(d.properties.value);
                               else
                                   return "#ccc";
                           }) /*
                           .on("mouseover", function() {
                               d3.select(this)
                                   .attr("transform", "scale(1.05)");
                           }) */;

                    // Print generated polygons to the console
                    console.log(d3.selectAll("path"));

                });
            });

        </script>