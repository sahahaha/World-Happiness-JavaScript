d3.csv('https://raw.githubusercontent.com/sahahaha/worldhappinessdata/main/happydata.csv',function (data) {
    // CSV section
      var body = d3.select('body')
      var selectData = [ { "text" : "GDPpercapita" },
                         { "text" : "SocialSupport" },
                         { "text" : "HealthyLifeExpectancy" },
                         { "text" : "Freedom" },
                         { "text" : "PerceptionsOfCorruption"},
                       ]
    
    
      // Select Y-axis Variable
      var span = body.append('span')
          .text('Select Y-Axis variable: ')
      var yInput = body.append('select')
          .attr('id','ySelect')
          .on('change',yChange)
        .selectAll('option')
          .data(selectData)
          .enter()
        .append('option')
          .attr('value', function (d) { return d.text })
          .text(function (d) { return d.text ;})
      body.append('br')
    
      // Variables
      var body = d3.select('body')
      var margin = { top: 200, right: 100, bottom: 500, left: 100 }
      var h = 1000 - margin.top - margin.bottom
      var w = 800 - margin.left - margin.right
      var formatValue = d3.format('.01f')
      // Scales
      var colorScale = d3.scale.category20()
      var xScale = d3.scale.linear()
        .domain([
          d3.min([0,d3.min(data,function (d) { return d.HappinessScore })]),
          d3.max([0,d3.max(data,function (d) { return d.HappinessScore })])
          ])
        .range([0,w])
      var yScale = d3.scale.linear()
        .domain([
          d3.min([0,d3.min(data,function (d) { return d.GDPpercapita})]),
          d3.max([0,d3.max(data,function (d) { return d.GDPpercapita})])
          ])
        .range([h,-50])
      // SVG 
      var svg = body.append('svg')
          .attr('height',h + margin.top + margin.bottom)
          .attr('width',w + margin.left + margin.right)
        .append('g')
          .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
      // X-axis
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(formatValue)
        .ticks(10)
        .orient('bottom')
      // Y-axis
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickFormat(formatValue)
        .ticks(10)
        .orient('left')
      // Circles
      var circles = svg.selectAll('circle')
          .data(data)
          .enter()
        .append('circle')
          .attr('cx',function (d) { return xScale(d.HappinessScore) })
          .attr('cy',function (d) { return yScale(d.GDPpercapita) })
          .attr('r','10')
          .attr('stroke','black')
          .attr('stroke-width',1)
          .attr('fill',function (d,i) { return colorScale(i) })
          .on('mouseover', function () {
            d3.select(this)
              .transition()
              .duration(500)
              .attr('r',20)
              .attr('stroke-width',3)
          })
          .on('mouseout', function () {
            d3.select(this)
              .transition()
              .duration(500)
              .attr('r',10)
              .attr('stroke-width',1)
          })
        .append('title') // Tooltip
          .text(function (d) { return 'Country: ' + d.Country +
                              '\nRegion: ' + d.RegionalIndicator +
                               '\nHappiness Score: ' + d.HappinessScore +
                               '\nY Value: ' + d.GDPpercapita
        })
      // X-axis
      svg.append('g')
          .attr('class','axis')
          .attr('id','xAxis')
          .attr('transform', 'translate(0,' + h + ')')
          .call(xAxis)
        .append('text') // X-axis Label
          .attr('id','xAxisLabel')
          .attr('y',-10)
          .attr('x',w)
          .attr('dy','.71em')
          .style('text-anchor','end')
          .text('Happiness Score')
      // Y-axis
      svg.append('g')
          .attr('class','axis')
          .attr('id','yAxis')
          .call(yAxis)
        .append('text') // y-axis Label
          .attr('id', 'yAxisLabel')
          .attr('transform','rotate(-90)')
          .attr('x',0)
          .attr('y',5)
          .attr('dy','.71em')
          .style('text-anchor','end')
          .text('GDP Per Capita')
    
      function yChange() {
        var value = this.value // get the new y value
        yScale // change the yScale
          .domain([
            d3.min([0,d3.min(data,function (d) { return d[value] })]),
            d3.max([0,d3.max(data,function (d) { return d[value] })])
            ])
        yAxis.scale(yScale) // change the yScale
        d3.select('#yAxis') // redraw the yAxis
          .transition().duration(100)
          .call(yAxis)
        d3.select('#yAxisLabel') // change the yAxisLabel
          .text(value)    
        d3.selectAll('circle') // move the circles
          .transition().duration(100)
          .delay(function (d,i) { return i*5})
            .attr('cy',function (d) { return yScale(d[value]) })
        circles // updates text label
            .text(function (d) { return 'Country: ' + d.Country +
                                '\nRegion: ' + d.RegionalIndicator +
                                '\nHappiness Score: ' + d.HappinessScore +
                                '\nY Value: ' + d[value]
          })

            

      }
    
    })