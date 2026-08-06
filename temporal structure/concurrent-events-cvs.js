
(function(){
  const container=d3.select("#d3-container-3");
  const colors={
    "Observation":"#3659df",
    "Landscape":"#0a8d70",
    "Planning":"#7b61d9",
    "Infrastructure":"#d8a520",
    "Research":"#dfff47",
    "Building":"#ff6b3d",
    "Policy":"#db456f",
    "Technology":"#141814",
    "Public Service":"#35a58b"
  };
  container.append("div").attr("class","chart-topbar").html(
    `<strong>Urban environmental adaptation</strong><span>15 CSV records · 1840–2024</span>`
  );

  d3.csv("events.csv").then(data=>{
    data.forEach(d=>{d.start=+d.start;d.end=+d.end});
    const outer=Math.max(container.node().clientWidth,1080);
    const row=44;
    const m={top:58,right:46,bottom:68,left:250};
    const w=outer-m.left-m.right;
    const ih=data.length*row;
    const h=ih+m.top+m.bottom;

    const svg=container.append("svg").attr("width",outer).attr("height",h);
    const g=svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
    const x=d3.scaleLinear()
      .domain([d3.min(data,d=>d.start)-5,d3.max(data,d=>d.end)+5])
      .range([0,w]);
    const y=d3.scaleBand()
      .domain(data.map(d=>d.name))
      .range([0,ih])
      .padding(.27);

    g.append("g").attr("transform",`translate(0,${ih})`)
      .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")).tickSize(-ih).tickPadding(12))
      .call(s=>s.selectAll("line").attr("stroke","rgba(20,24,20,.10)"))
      .call(s=>s.selectAll("text").attr("font-size",9).attr("fill","#6e746d"));

    g.selectAll(".row").data(data).join("line")
      .attr("x1",-m.left).attr("x2",w)
      .attr("y1",d=>y(d.name)+y.bandwidth()+8)
      .attr("y2",d=>y(d.name)+y.bandwidth()+8)
      .attr("stroke","rgba(20,24,20,.11)");

    g.selectAll(".label").data(data).join("text")
      .attr("x",-16)
      .attr("y",d=>y(d.name)+y.bandwidth()/2+4)
      .attr("text-anchor","end")
      .attr("font-size",9.5)
      .attr("font-weight",500)
      .text(d=>d.name);

    const tooltip=d3.select("body").append("div").attr("class","tooltip").style("opacity",0);

    g.selectAll(".bar").data(data).join("rect")
      .attr("x",d=>x(d.start))
      .attr("y",d=>y(d.name))
      .attr("height",y.bandwidth())
      .attr("rx",4)
      .attr("width",0)
      .attr("fill",d=>colors[d.category]||"#555")
      .attr("stroke","rgba(20,24,20,.30)") // hairline keeps the lime bars anchored on paper
      .attr("stroke-width",.75)
      .style("cursor","pointer")
      .on("mousemove",function(event,d){
        d3.select(this).attr("stroke","#141814").attr("stroke-width",1.4);
        tooltip.style("opacity",1)
          .html(`<strong>${d.name}</strong><br>${d.start}–${d.end}<br>${d.end-d.start} years<br>${d.category}`)
          .style("left",`${event.pageX+14}px`)
          .style("top",`${event.pageY-18}px`);
      })
      .on("mouseleave",function(){
        d3.select(this).attr("stroke","rgba(20,24,20,.30)").attr("stroke-width",.75);
        tooltip.style("opacity",0);
      })
      .transition()
      .duration(900)
      .delay((d,i)=>i*40)
      .attr("width",d=>Math.max(5,x(d.end)-x(d.start)));

    // Category tags at the end of each bar — labels on the data itself,
    // so nine categories stay legible without a separate legend.
    // Bars reaching the data edge carry their tag inside the bar instead,
    // with ink or paper text chosen by the bar color's lightness.
    const nearEdge=d=>x(d.end)>w-95;
    g.selectAll(".cat-tag").data(data).join("text")
      .attr("class","cat-tag")
      .attr("x",d=>nearEdge(d)?x(d.end)-10:x(d.end)+9)
      .attr("y",d=>y(d.name)+y.bandwidth()/2+3)
      .attr("text-anchor",d=>nearEdge(d)?"end":"start")
      .attr("font-size",7.5)
      .attr("letter-spacing",".08em")
      .attr("fill",d=>nearEdge(d)
        ?(d3.hsl(colors[d.category]).l>.6?"#141814":"#f7f4ed")
        :"#6e746d")
      .style("text-transform","uppercase")
      .style("pointer-events","none")
      .style("opacity",0)
      .text(d=>d.category)
      .transition()
      .delay((d,i)=>650+i*40)
      .duration(400)
      .style("opacity",d=>nearEdge(d)?.92:1);

    g.append("line")
      .attr("x1",x(2024)).attr("x2",x(2024))
      .attr("y1",-22).attr("y2",ih)
      .attr("stroke","#141814").attr("stroke-width",1.4)
      .attr("stroke-dasharray","5 5");

    g.append("text")
      .attr("x",x(2024)-5).attr("y",-29)
      .attr("text-anchor","end")
      .attr("font-size",9).attr("font-weight",600)
      .text("2024 / DATA END");
  });
})();
