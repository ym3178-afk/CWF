
(function(){
  const container=d3.select("#d3-container-2");
  const colors={planning:"#3659df",design:"#7b61d9",development:"#0a8d70",testing:"#ff6b3d",documentation:"#d8a520",deployment:"#db456f"};
  container.append("div").attr("class","chart-topbar").html(
    `<strong>Community program concurrency</strong><span>Duration · category · completion</span>`
  );
  const data=[
    {name:"Needs Assessment",start:"2023-01-01",end:"2023-02-15",category:"planning",progress:.9},
    {name:"Housing Support",start:"2023-01-15",end:"2023-06-30",category:"design",progress:.7},
    {name:"Food Security",start:"2023-03-01",end:"2023-08-31",category:"development",progress:.6},
    {name:"Mental Health Services",start:"2023-04-01",end:"2023-09-30",category:"testing",progress:.4},
    {name:"Youth Education",start:"2023-05-01",end:"2023-10-31",category:"documentation",progress:.8},
    {name:"Community Outreach",start:"2023-07-01",end:"2023-12-31",category:"deployment",progress:.3}
  ].map(d=>({...d,start:new Date(d.start),end:new Date(d.end)}));
  const outer=Math.max(container.node().clientWidth,980), row=58;
  const m={top:54,right:46,bottom:66,left:205},w=outer-m.left-m.right,ih=data.length*row,h=ih+m.top+m.bottom;
  const svg=container.append("svg").attr("width",outer).attr("height",h);
  const g=svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
  const x=d3.scaleTime().domain([d3.min(data,d=>d.start),d3.max(data,d=>d.end)]).range([0,w]);
  const y=d3.scaleBand().domain(data.map(d=>d.name)).range([0,ih]).padding(.31);
  g.append("g").attr("transform",`translate(0,${ih})`)
    .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b")).tickSize(-ih).tickPadding(12))
    .call(s=>s.selectAll("line").attr("stroke","rgba(20,24,20,.10)"))
    .call(s=>s.selectAll("text").attr("font-size",9).attr("fill","#6e746d"));
  g.selectAll(".row").data(data).join("line")
    .attr("x1",-m.left).attr("x2",w).attr("y1",d=>y(d.name)+y.bandwidth()+10).attr("y2",d=>y(d.name)+y.bandwidth()+10)
    .attr("stroke","rgba(20,24,20,.12)");
  g.selectAll(".label").data(data).join("text")
    .attr("x",-16).attr("y",d=>y(d.name)+y.bandwidth()/2+4).attr("text-anchor","end")
    .attr("font-size",10).attr("font-weight",500).text(d=>d.name);
  const tooltip=d3.select("body").append("div").attr("class","tooltip").style("opacity",0);
  g.selectAll(".bar").data(data).join("rect")
    .attr("x",d=>x(d.start)).attr("y",d=>y(d.name)).attr("height",y.bandwidth()).attr("rx",5)
    .attr("width",0).attr("fill",d=>colors[d.category]).style("cursor","pointer")
    .on("mousemove",(event,d)=>{
      tooltip.style("opacity",1).html(`<strong>${d.name}</strong><br>${d3.timeFormat("%b %d")(d.start)}–${d3.timeFormat("%b %d, %Y")(d.end)}<br>${Math.round(d.progress*100)}% complete`)
      .style("left",`${event.pageX+14}px`).style("top",`${event.pageY-18}px`);
    }).on("mouseleave",()=>tooltip.style("opacity",0))
    .transition().duration(800).delay((d,i)=>i*70).attr("width",d=>x(d.end)-x(d.start));
  g.selectAll(".progress").data(data).join("line")
    .attr("x1",d=>x(d.start)+6).attr("x2",d=>x(d.start)+6)
    .attr("y1",d=>y(d.name)+y.bandwidth()-7).attr("y2",d=>y(d.name)+y.bandwidth()-7)
    .attr("stroke","#f7f4ed").attr("stroke-width",3).attr("stroke-linecap","round")
    .transition().duration(800).delay((d,i)=>250+i*70)
    .attr("x2",d=>x(d.start)+(x(d.end)-x(d.start))*d.progress-6);
})();
