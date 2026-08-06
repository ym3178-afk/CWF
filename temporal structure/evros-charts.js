
(function(){
  const ink="#141814", muted="#6e746d", paper="#f7f4ed";
  const lime="#dfff47", olive="#829b36", coral="#ff6b3d";
  const tooltip=d3.select("body").append("div").attr("class","tooltip").style("opacity",0);

  function bar(container,left,right){
    container.append("div").attr("class","chart-topbar")
      .html(`<strong>${left}</strong><span>${right}</span>`);
  }
  function show(event,html){
    tooltip.style("opacity",1).html(html)
      .style("left",`${event.pageX+14}px`)
      .style("top",`${event.pageY-18}px`);
  }
  function hide(){tooltip.style("opacity",0);}
  const colors={
    Legal:ink,
    Infrastructure:olive,
    Crisis:coral,
    Research:"#596057",
    Environment:"#a7ad9c"
  };

  // VERIFIED TIMELINE
  (async function(){
    const c=d3.select("#evros-timeline");
    bar(c,"Verified historical timeline","1923–2024");
    const data=await d3.csv("evros-timeline.csv",d=>({...d,date:new Date(d.date)}));
    const outer=Math.max(c.node().clientWidth,1080),h=530;
    const m={top:62,right:58,bottom:78,left:58},w=outer-m.left-m.right,ih=h-m.top-m.bottom;
    const svg=c.append("svg").attr("width",outer).attr("height",h);
    const g=svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
    const x=d3.scaleTime().domain([new Date("1920-01-01"),new Date("2026-01-01")]).range([0,w]);
    const levels=[72,148,224,300];

    g.append("line").attr("x1",0).attr("x2",w)
      .attr("y1",ih-42).attr("y2",ih-42)
      .attr("stroke",ink).attr("stroke-width",1.4);

    g.append("g").attr("transform",`translate(0,${ih-42})`)
      .call(d3.axisBottom(x).ticks(d3.timeYear.every(10))
        .tickFormat(d3.timeFormat("%Y")).tickSize(-ih+76).tickPadding(12))
      .call(s=>s.selectAll("line").attr("stroke","rgba(20,24,20,.10)"))
      .call(s=>s.selectAll("text").attr("font-size",9).attr("fill",muted))
      .call(s=>s.select(".domain").remove());

    g.selectAll(".stem").data(data).join("line")
      .attr("x1",d=>x(d.date)).attr("x2",d=>x(d.date))
      .attr("y1",(d,i)=>levels[i%4]).attr("y2",ih-42)
      .attr("stroke","rgba(20,24,20,.23)").attr("stroke-dasharray","3 4");

    g.selectAll(".point").data(data).join("circle")
      .attr("cx",d=>x(d.date)).attr("cy",(d,i)=>levels[i%4])
      .attr("r",0).attr("fill",d=>colors[d.category]||ink)
      .attr("stroke",paper).attr("stroke-width",3)
      .style("cursor","pointer")
      .on("mousemove",(e,d)=>show(e,`<strong>${d.name}</strong><br>${d3.timeFormat("%d %b %Y")(d.date)}<br>${d.detail}`))
      .on("mouseleave",hide)
      .transition().delay((d,i)=>i*80).duration(480).attr("r",8);

    g.selectAll(".label").data(data).join("text")
      .attr("x",d=>x(d.date)).attr("y",(d,i)=>levels[i%4]-17)
      .attr("text-anchor","middle").attr("font-size",8.5)
      .text(d=>d.name.length>27?d.name.slice(0,26)+"…":d.name);
  })();

  // VERIFIED GANTT
  (async function(){
    const c=d3.select("#evros-gantt");
    bar(c,"Verified duration chart","No inferred start years");
    const data=await d3.csv("evros-events.csv",d=>({...d,start:+d.start,end:+d.end}));
    const outer=Math.max(c.node().clientWidth,1040),row=64;
    const m={top:64,right:46,bottom:70,left:250},w=outer-m.left-m.right,ih=data.length*row,h=ih+m.top+m.bottom;
    const svg=c.append("svg").attr("width",outer).attr("height",h);
    const g=svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
    const x=d3.scaleLinear().domain([1920,2026]).range([0,w]);
    const y=d3.scaleBand().domain(data.map(d=>d.name)).range([0,ih]).padding(.31);

    g.append("g").attr("transform",`translate(0,${ih})`)
      .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")).tickSize(-ih).tickPadding(12))
      .call(s=>s.selectAll("line").attr("stroke","rgba(20,24,20,.10)"))
      .call(s=>s.selectAll("text").attr("font-size",9).attr("fill",muted))
      .call(s=>s.select(".domain").remove());

    g.selectAll(".row").data(data).join("line")
      .attr("x1",-m.left).attr("x2",w)
      .attr("y1",d=>y(d.name)+y.bandwidth()+10)
      .attr("y2",d=>y(d.name)+y.bandwidth()+10)
      .attr("stroke","rgba(20,24,20,.11)");

    g.selectAll(".label").data(data).join("text")
      .attr("x",-16).attr("y",d=>y(d.name)+y.bandwidth()/2+4)
      .attr("text-anchor","end").attr("font-size",9.5).text(d=>d.name);

    g.selectAll(".bar").data(data).join("rect")
      .attr("x",d=>x(d.start)).attr("y",d=>y(d.name))
      .attr("height",y.bandwidth()).attr("rx",4).attr("width",0)
      .attr("fill",d=>colors[d.category]||ink)
      .attr("stroke","rgba(20,24,20,.25)").attr("stroke-width",.7)
      .on("mousemove",(e,d)=>show(e,`<strong>${d.name}</strong><br>${d.start}–${d.end}<br>${d.category}`))
      .on("mouseleave",hide)
      .transition().duration(850).delay((d,i)=>i*85)
      .attr("width",d=>Math.max(5,x(d.end)-x(d.start)));
  })();

  // INTERPRETIVE SEQUENCE
  (async function(){
    const c=d3.select("#evros-sequence");
    bar(c,"Analytical event sequence","Verified claims + labeled interpretation");
    const data=await d3.csv("evros-sequence.csv",d=>({...d,order:+d.order}));
    const outer=Math.max(c.node().clientWidth,1080),h=590;
    const m={top:90,right:70,bottom:70,left:70},w=outer-m.left-m.right;
    const svg=c.append("svg").attr("width",outer).attr("height",h);
    const g=svg.append("g").attr("transform",`translate(${m.left},${m.top})`);
    const x=d3.scalePoint().domain(data.map(d=>d.order)).range([0,w]).padding(.35);
    const yy=(d,i)=>i%2===0?140:310;

    g.append("path").datum(data)
      .attr("d",d3.line().x(d=>x(d.order)).y((d,i)=>yy(d,i)).curve(d3.curveCatmullRom.alpha(.6)))
      .attr("fill","none").attr("stroke",ink).attr("stroke-width",1.5);

    const node=g.selectAll(".node").data(data).join("g")
      .attr("transform",(d,i)=>`translate(${x(d.order)},${yy(d,i)})`);

    node.append("circle").attr("r",14)
      .attr("fill",d=>d.status==="Interpretive"?lime:olive)
      .attr("stroke",paper).attr("stroke-width",4);

    node.append("text").attr("y",-34).attr("text-anchor","middle")
      .attr("font-size",10).attr("font-weight",500).text(d=>d.name);

    node.append("text").attr("class","evros-status")
      .attr("y",-55).attr("text-anchor","middle")
      .attr("fill",d=>d.status==="Interpretive"?"#6b7e1f":muted)
      .text(d=>d.status);

    node.append("text").attr("y",40).attr("text-anchor","middle")
      .attr("font-size",8.5).attr("fill",muted)
      .each(function(d){
        const words=d.description.split(" "),lines=[""];
        words.forEach(word=>{
          const i=lines.length-1;
          if((lines[i]+" "+word).trim().length>28) lines.push(word);
          else lines[i]=(lines[i]+" "+word).trim();
        });
        d3.select(this).selectAll("tspan").data(lines.slice(0,3)).join("tspan")
          .attr("x",0).attr("dy",(l,i)=>i===0?0:13).text(l=>l);
      });
  })();

  // BINARY FIRE CALENDAR
  (async function(){
    const c=d3.select("#evros-heatmap");
    bar(c,"Binary wildfire calendar","0 = outside period · 1 = documented 17 days");
    const parse=d3.utcParse("%-m/%-d/%Y");
    const data=await d3.csv("evros-fire.csv",d=>({Date:parse(d.Date),Value:+d.Close}));
    const cell=14,gap=3,outer=Math.max(c.node().clientWidth,1060),h=340;
    const gridW=53*(cell+gap),left=Math.max(82,(outer-gridW)/2),top=65;
    const svg=c.append("svg").attr("width",outer).attr("height",h);
    const g=svg.append("g").attr("transform",`translate(${left},${top})`);
    const monday=d3.utcMonday,day=d=>(d.getUTCDay()+6)%7;

    g.selectAll("rect").data(data).join("rect")
      .attr("x",d=>monday.count(d3.utcYear(d.Date),d.Date)*(cell+gap))
      .attr("y",d=>day(d.Date)*(cell+gap))
      .attr("width",cell).attr("height",cell).attr("rx",2.5)
      .attr("fill",d=>d.Value===1?coral:"#d4d6d0")
      .attr("stroke","rgba(20,24,20,.07)")
      .on("mousemove",(e,d)=>show(e,`<strong>${d3.utcFormat("%d %b %Y")(d.Date)}</strong><br>${d.Value===1?"Within documented fire period":"Outside documented fire period"}`))
      .on("mouseleave",hide);

    g.selectAll(".day").data(["MON","TUE","WED","THU","FRI","SAT","SUN"]).join("text")
      .attr("x",-12).attr("y",(d,i)=>i*(cell+gap)+10)
      .attr("text-anchor","end").attr("font-size",8).attr("fill",muted).text(d=>d);

    const months=d3.utcMonths(new Date(Date.UTC(2023,0,1)),new Date(Date.UTC(2024,0,1)));
    g.selectAll(".month").data(months).join("text")
      .attr("x",d=>monday.count(d3.utcYear(d),d)*(cell+gap))
      .attr("y",-16).attr("font-size",9).text(d3.utcFormat("%b"));

    const legend=svg.append("g").attr("transform",`translate(${left},${255})`);
    legend.append("rect").attr("width",34).attr("height",10).attr("rx",2).attr("fill","#d4d6d0");
    legend.append("text").attr("x",44).attr("y",9).attr("font-size",8).text("OUTSIDE FIRE PERIOD");
    legend.append("rect").attr("x",180).attr("width",34).attr("height",10).attr("rx",2).attr("fill",coral);
    legend.append("text").attr("x",224).attr("y",9).attr("font-size",8).text("17-DAY FIRE PERIOD");
  })();
})();
