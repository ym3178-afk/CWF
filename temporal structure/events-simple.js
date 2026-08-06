
(function(){
  const container=d3.select("#d3-container-1");
  container.append("div").attr("class","chart-topbar").html(
    `<strong>Extreme weather signals</strong><div class="chart-legend"><span><i style="background:#ff6b3d"></i>Major</span><span><i style="background:#db456f"></i>Catastrophic</span></div>`
  );
  const events=[
    {date:"2018-09-14",name:"Florence",category:"major",location:"Carolinas",impact:24},
    {date:"2018-10-10",name:"Michael",category:"catastrophic",location:"Florida",impact:25.5},
    {date:"2019-09-01",name:"Dorian",category:"major",location:"Southeast",impact:5.1},
    {date:"2020-08-27",name:"Laura",category:"major",location:"Louisiana",impact:19},
    {date:"2021-08-29",name:"Ida",category:"catastrophic",location:"Louisiana / Northeast",impact:75},
    {date:"2022-09-28",name:"Ian",category:"catastrophic",location:"Florida",impact:112.9},
    {date:"2023-08-30",name:"Idalia",category:"major",location:"Florida",impact:3.6},
    {date:"2024-07-08",name:"Beryl",category:"catastrophic",location:"Caribbean / Texas",impact:2.8},
    {date:"2024-09-16",name:"Helene",category:"major",location:"Southeast",impact:9.5},
    {date:"2024-10-10",name:"Milton",category:"catastrophic",location:"Florida",impact:8.5}
  ].map(d=>({...d,date:new Date(d.date)}));
  const outer=Math.max(container.node().clientWidth,980), h=520;
  const m={top:55,right:55,bottom:68,left:55},w=outer-m.left-m.right,ih=h-m.top-m.bottom;
  const svg=container.append("svg").attr("width",outer).attr("height",h);
  const g=svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
  const x=d3.scaleTime().domain(d3.extent(events,d=>d.date)).range([0,w]);
  const y=d3.scalePoint().domain(events.map(d=>d.name)).range([40,ih-45]).padding(.5);
  g.append("line").attr("x1",0).attr("x2",w).attr("y1",ih-28).attr("y2",ih-28).attr("stroke","#141814");
  g.append("g").attr("transform",`translate(0,${ih-28})`)
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y")).tickSize(-ih+55).tickPadding(12))
    .call(s=>s.selectAll("line").attr("stroke","rgba(20,24,20,.10)"))
    .call(s=>s.selectAll("text").attr("fill","#6e746d").attr("font-size",9));
  const tooltip=d3.select("body").append("div").attr("class","tooltip").style("opacity",0);
  g.selectAll(".stem").data(events).join("line")
    .attr("x1",d=>x(d.date)).attr("x2",d=>x(d.date))
    .attr("y1",d=>y(d.name)).attr("y2",ih-28)
    .attr("stroke","rgba(20,24,20,.22)").attr("stroke-dasharray","3 4");
  g.selectAll(".event").data(events).join("circle")
    .attr("cx",d=>x(d.date)).attr("cy",d=>y(d.name)).attr("r",0)
    .attr("fill",d=>d.category==="catastrophic"?"#db456f":"#ff6b3d")
    .attr("stroke","#f7f4ed").attr("stroke-width",3).style("cursor","pointer")
    .on("mousemove",(event,d)=>{
      tooltip.style("opacity",1).html(`<strong>${d.name}</strong><br>${d3.timeFormat("%b %d, %Y")(d.date)}<br>${d.location}<br>Estimated impact: $${d.impact}B`)
      .style("left",`${event.pageX+14}px`).style("top",`${event.pageY-18}px`);
    }).on("mouseleave",()=>tooltip.style("opacity",0))
    .transition().delay((d,i)=>i*80).duration(500)
    .attr("r",d=>6+Math.sqrt(d.impact)*.85);
  g.selectAll(".label").data(events).join("text")
    .attr("x",d=>x(d.date)).attr("y",d=>y(d.name)-15)
    .attr("text-anchor","middle").attr("font-size",9).attr("fill","#141814").text(d=>d.name);
})();
