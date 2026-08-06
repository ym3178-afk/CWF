
(function(){
  const container=d3.select("#d3-container-0");
  const palette=["#3659df","#ff6b3d","#0a8d70"];
  container.append("div").attr("class","chart-topbar").html(
    `<strong>Scale study / coordinate field</strong><span>Linear scales · axes · data binding</span>`
  );
  const outer=Math.max(container.node().clientWidth,960), h=500;
  const m={top:48,right:45,bottom:64,left:72}, w=outer-m.left-m.right, ih=h-m.top-m.bottom;
  const data=[
    {x:8,y:12,s:14},{x:18,y:22,s:18},{x:29,y:16,s:13},{x:38,y:31,s:23},
    {x:49,y:27,s:16},{x:61,y:39,s:26},{x:73,y:34,s:19},{x:84,y:46,s:30},{x:94,y:42,s:21}
  ];
  const svg=container.append("svg").attr("width",outer).attr("height",h);
  const g=svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
  const x=d3.scaleLinear().domain([0,100]).range([0,w]);
  const y=d3.scaleLinear().domain([0,50]).range([ih,0]);
  g.append("g").attr("transform",`translate(0,${ih})`)
    .call(d3.axisBottom(x).ticks(10).tickSize(-ih).tickPadding(12))
    .call(s=>s.selectAll("line").attr("stroke","rgba(20,24,20,.10)"))
    .call(s=>s.selectAll("text").attr("fill","#6e746d").attr("font-size",9));
  g.append("g")
    .call(d3.axisLeft(y).ticks(5).tickSize(-w).tickPadding(12))
    .call(s=>s.selectAll("line").attr("stroke","rgba(20,24,20,.10)"))
    .call(s=>s.selectAll("text").attr("fill","#6e746d").attr("font-size",9));
  const line=d3.line().x(d=>x(d.x)).y(d=>y(d.y)).curve(d3.curveCatmullRom);
  g.append("path").datum(data).attr("fill","none").attr("stroke","#141814").attr("stroke-width",1.5)
    .attr("d",line).attr("stroke-dasharray",function(){return this.getTotalLength()})
    .attr("stroke-dashoffset",function(){return this.getTotalLength()})
    .transition().duration(1100).attr("stroke-dashoffset",0);
  g.selectAll("circle").data(data).join("circle")
    .attr("cx",d=>x(d.x)).attr("cy",d=>y(d.y)).attr("r",0)
    .attr("fill",(d,i)=>palette[i%palette.length]).attr("stroke","#f7f4ed").attr("stroke-width",2)
    .transition().delay((d,i)=>i*90).duration(500).attr("r",d=>Math.sqrt(d.s)*2.1);
  g.append("text").attr("x",w).attr("y",ih+47).attr("text-anchor","end")
    .attr("font-size",9).attr("fill","#6e746d").text("X VALUE / 0–100");
  g.append("text").attr("transform","rotate(-90)").attr("x",0).attr("y",-50)
    .attr("text-anchor","end").attr("font-size",9).attr("fill","#6e746d").text("Y VALUE / 0–50");
})();
