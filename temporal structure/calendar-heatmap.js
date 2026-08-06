
(function(){
  const container=d3.select("#d3-container-4");
  container.append("div").attr("class","chart-topbar").html(
    `<strong>Daily urban heat anomaly</strong><span>754 weekday records · 2021–2023</span>`
  );

  const parse=d3.utcParse("%-m/%-d/%Y");
  d3.csv("synthetic-data.csv",d=>({Date:parse(d.Date),Value:+d.Close})).then(data=>{
    const years=d3.groups(data,d=>d.Date.getUTCFullYear()).sort((a,b)=>a[0]-b[0]);
    const cell=12,gap=3;
    const yearHeight=5*(cell+gap)+54; // data holds weekdays only: five rows per year
    const innerWidth=53*(cell+gap);
    const outer=Math.max(container.node().clientWidth,1080);
    const left=Math.max(82,(outer-innerWidth)/2);
    const top=38;
    const bottom=72;
    const h=top+years.length*yearHeight+bottom;

    const svg=container.append("svg").attr("width",outer).attr("height",h);
    // Diverging scale with a quiet center: near-baseline days recede into
    // a neutral paper gray, so only genuine anomalies carry color —
    // cool violet for below-baseline, lime rising to orange for heat.
    const cool=d3.interpolateRgb("#5641bd","#e3dfd3");
    const warm=d3.piecewise(d3.interpolateRgb,["#e3dfd3","#dfff47","#ff6b3d"]);
    const color=d3.scaleDiverging()
      .domain([-100,0,100])
      .interpolator(t=>t<=.5?cool(t*2):warm((t-.5)*2));
    const monday=d3.utcMonday;
    const dayIndex=d=>(d.getUTCDay()+6)%7;

    years.forEach(([year,values],yearIndex)=>{
      const g=svg.append("g")
        .attr("transform",`translate(${left},${top+yearIndex*yearHeight})`);

      g.append("text")
        .attr("x",-25).attr("y",-14)
        .attr("text-anchor","end")
        .attr("font-size",11).attr("font-weight",600)
        .text(year);

      g.selectAll(".day-cell")
        .data(values).join("rect")
        .attr("class","day-cell")
        .attr("x",d=>monday.count(d3.utcYear(d.Date),d.Date)*(cell+gap))
        .attr("y",d=>dayIndex(d.Date)*(cell+gap))
        .attr("width",cell).attr("height",cell).attr("rx",2.5)
        .attr("fill",d=>color(d.Value))
        .attr("stroke","rgba(20,24,20,.07)") // faint outline keeps near-neutral cells defined
        .style("opacity",0)
        .append("title")
        .text(d=>`${d3.utcFormat("%b %d, %Y")(d.Date)}\nHeat anomaly: ${d.Value>0?"+":""}${d.Value}`);

      g.selectAll(".day-cell")
        .transition().duration(500)
        .delay((d,i)=>i*.8)
        .style("opacity",1);

      if(yearIndex===0){
        g.selectAll(".day-label")
          .data(["MON","TUE","WED","THU","FRI"])
          .join("text")
          .attr("x",-12)
          .attr("y",(d,i)=>i*(cell+gap)+9)
          .attr("text-anchor","end")
          .attr("font-size",7.5)
          .attr("fill","#6e746d")
          .text(d=>d);
      }

      const months=d3.utcMonths(
        d3.utcYear(values[0].Date),
        d3.utcYear.offset(d3.utcYear(values[0].Date),1)
      );
      g.selectAll(".month")
        .data(months).join("text")
        .attr("x",d=>monday.count(d3.utcYear(d),d)*(cell+gap))
        .attr("y",-14)
        .attr("font-size",8)
        .attr("fill","#141814")
        .text(d3.utcFormat("%b"));
    });

    const legend=svg.append("g")
      .attr("transform",`translate(${left},${h-42})`);
    const stops=d3.range(-100,101,10);
    legend.selectAll("rect").data(stops).join("rect")
      .attr("x",(d,i)=>i*17)
      .attr("width",17).attr("height",9).attr("rx",2)
      .attr("fill",d=>color(d));

    legend.append("text")
      .attr("x",0).attr("y",27)
      .attr("font-size",8)
      .text("COOLER THAN BASELINE");

    // Center anchor: a small tick and "0" marking the neutral point
    const mid=17*stops.length/2;
    legend.append("line")
      .attr("x1",mid).attr("x2",mid)
      .attr("y1",11).attr("y2",16)
      .attr("stroke","#141814").attr("stroke-width",1);
    legend.append("text")
      .attr("x",mid).attr("y",27)
      .attr("text-anchor","middle")
      .attr("font-size",8)
      .text("0 / BASELINE");

    legend.append("text")
      .attr("x",17*stops.length).attr("y",27)
      .attr("text-anchor","end")
      .attr("font-size",8)
      .text("EXTREME HEAT");
  });
})();
