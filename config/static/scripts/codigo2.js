
function opp() {
  var text = document.getElementById("input-word").value;
  unpaint();
  var tour = [];
  var tour2 = [];

  if (text.length % 2 == 0) {
    if (check_word(text, 0, 1)){
      tour3=[1];
      for(var i=0; i<text.length/2; i++){
        tour3.push(1);
      }
      for(var i=0; i<text.length/2; i++){
        tour3.push(2);
      }
      tour3.push(3);
      paint_tour(tour3, 0, 500, 0);
      alert("La palabra es palindromo");
      console.log(true) 
    } else {
      alert("La palabra no es palindromo");
      console.log(false)
    }
  }else {
    alert("La cadena debe tener un numero par de caracteres");
  }
  tour3=[1];
  for(var i=0; i<text.length/2; i++){
    tour3.push(1);
  }
  for(var i=0; i<text.length/2; i++){
    tour3.push(2);
  }
  tour3.push(3);


if(text.length % 2 == 0){
  
}

  function paint_tour(tour, index ,speed, index2){
    node = myDiagram.findNodeForKey(tour[index]);
    if (index < tour.length) {    
    window.setTimeout(function(){ 
      paint_node(node);
      let links = node.findTreeChildrenLinks();
      let link = links.ub._dataArray.filter(function (link) {return link.fromNode == node;});
      if (tour[index]==1 && tour[index+1]==1){
        check_link(link[0], text, index2);
        paint_link(link[0]);
      } else if (tour[index]==1 && tour[index+1]==2) {
        check_link(link[1], text, index2);
        paint_link(link[1]);
      }
      if (tour[index]==2 && tour[index+1]==2){
        check_link(link[0], text, index2);
        paint_link(link[0]);
      } else if (tour[index]==2 && tour[index+1]==3) {
        check_link(link[1], text, index2);
        paint_link(link[1]);
      }
      window.setTimeout(function(){ 
        unpaint_node(node);
        paint_tour(tour, index+1, speed, index2+1);
      },speed);
    },speed/2);
  } else {
    paint_node(myDiagram.findNodeForKey(tour[index-1]));
  }
    

  }  
function check_word(text, index, keynode) {
  node= myDiagram.findNodeForKey(keynode);
  tour.push(keynode);
  let stack = myDiagram.findNodeForKey("4");
  // console.log(index>=text.length);
  if( keynode==1 && (text[index]=="b" && stack.data.stack[stack.data.stack.length-1]=="b" || text[index]=="a" && stack.data.stack[stack.data.stack.length-1]=="a")){
    let temp2=[];
    temp2.push(stack.data.stack[stack.data.stack.length-1]);
    stack.data.stack.pop(); 
    if(check_word(text, index+1, keynode+1)){
      tour2.push(keynode);
      return true;
    } else {
      tour.pop();
      stack.data.stack.push(temp2);
    }
  }
  if( keynode==1 && (text[index]=="b" && stack.data.stack[stack.data.stack.length-1]=="b" || text[index]=="a" && stack.data.stack[stack.data.stack.length-1]=="b" || text[index]=="b" && stack.data.stack[stack.data.stack.length-1]=="a" || text[index]=="b" && stack.data.stack[stack.data.stack.length-1]=="#" || text[index]=="a" && stack.data.stack[stack.data.stack.length-1]=="#")){
    stack.data.stack.push(text[index]);
    
    if(check_word(text, index+1, keynode)){
      tour2.push(keynode);
      return true;
    } else {
      tour.pop();
      stack.data.stack.pop();
    }
  }
  if(keynode==2 && (text[index]=="b" && stack.data.stack[stack.data.stack.length-1]=="b" || text[index]=="a" && stack.data.stack[stack.data.stack.length-1]=="a")){
    let temp2=[];
    temp2.push(stack.data.stack[stack.data.stack.length-1]);
    stack.data.stack.pop();
    
    if(check_word(text, index+1, keynode)){
      tour2.push(keynode);
      return true;
    } else {
      tour.pop();
      stack.data.stack.push(temp2);
    }
  }
  if( keynode==2 && (index>=text.length && stack.data.stack[stack.data.stack.length-1]=="#")){
    tour2.push(keynode);
    tour.push(3);
    return true
  }
  tour.pop();
  return false;
}

function unpaint() {
  myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
  
}

function check_link(link, text, index) {
  let stack = myDiagram.findNodeForKey("4");
  var top = stack.data.stack.length-1;
    for (x in link.data.pila) {
      var texto=link.data.pila[x]
      if (texto[0]==text[index] || texto[0]=="λ"){
        if (texto[2]==stack.data.stack[top]){ 
            item1=String(texto[4]);
            item2=String(texto[5]);
            window.setTimeout(function(){
              remove_element_from_stack()
              window.setTimeout(function(){
                add_item_to_the_stack(item1);
                window.setTimeout(function(){
                  add_item_to_the_stack(item2); 
                },200);           
              },200);
            },200);
            
            
          };
        }
      } 
    
  
  
}

function add_item_to_the_stack(a) {
  myDiagram.model.commit(function(){
    let nodeData = myDiagram.findNodeForKey("4");
    if (a!=="λ" && a!=="undefined"){
      nodeData.data.stack.push(a);
    }
    nodeData.updateTargetBindings();
  });
}

function remove_element_from_stack(top) {
  myDiagram.model.commit(function(){
    let nodeData = myDiagram.findNodeForKey("4");
    nodeData.data.stack.pop();
    nodeData.updateTargetBindings();
  });
}

function paint_node(node) {
  var shape = node.findObject("SHAPE");
  shape.fill = "green";
}

function unpaint_node(node) {
  var shape = node.findObject("SHAPE");
  shape.fill = "white";
}

function paint_link(link) {
  window.setTimeout(function(){ 
    var shape = link.findObject("link9");
    var shape2 = link.findObject("toArrow");
    shape2.stroke= "green";
    shape.stroke= "green";
    window.setTimeout(function(){ 
      shape2.stroke= "black";
      shape.stroke= "black";
    },200);
  },200);

}

function check_acceptance_status(node) {
  if(node.data.category=="accept") {
    alert("Cadena aceptada");
    return true;
  } else {
    alert("Cadena rechazada");
    return false;
  }
}


}

