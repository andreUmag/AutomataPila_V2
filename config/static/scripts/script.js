function init() {
      var $ = go.GraphObject.make;  // for conciseness in defining templates


      
      // some constants that will be reused within templates
      var roundedRectangleParams = {
        parameter1: 2,  // set the rounded corner
        spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight  // make content go all the way to inside edges of rounded corners
      };

   
      

      myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
          {
            "animationManager.initialAnimationStyle": go.AnimationManager.None,
            "InitialAnimationStarting": function(e) {
                var animation = e.subject.defaultAnimation;
                animation.easing = go.Animation.EaseOutExpo;
                animation.duration = 1;
                animation.add(e.diagram, 'scale', 0.1, 1);
                animation.add(e.diagram, 'opacity', 0, 1);
            },

            // have mouse wheel events zoom in and out instead of scroll up and down
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            // support double-click in background creating a new node
            "clickCreatingTool.archetypeNodeData": { text: "new node" },
            // enable undo & redo
            "undoManager.isEnabled": true,
            allowMove: false,
            allowHorizontalScroll: false,
            allowVerticalScroll: false,
            
            positionComputation: function (diagram, pt) {
              return new go.Point(Math.floor(pt.x), Math.floor(pt.y));
            }
          });

      // when the document is modified, add a "*" to the title and enable the "Save" button
      myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });

      // define the Node template
      myDiagram.nodeTemplate =
        $(go.Node, "Auto",
          {
            locationSpot: go.Spot.Top,
            isShadowed: true, shadowBlur: 5,
            shadowOffset: new go.Point(0, 1),
            shadowColor: "rgba(0, 0, 0, .14)"
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          // define the node's outer shape, which will surround the TextBlock
          $(go.Shape, "Circle", roundedRectangleParams,
            {
              name: "SHAPE", fill: "white", strokeWidth: 10,
              stroke: null,
              portId: "",  // this Shape is the Node's port, not the whole Node
              fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
              toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
              cursor: "pointer",
              
            }

            ),
            $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 2, stroke: "black" }),
          $(go.TextBlock,
            {
              font: "bold 11pt helvetica, bold arial, sans-serif", margin: 7, stroke: "rgba(0, 0, 0, .87)",
              editable: true  // editing the text automatically updates the model data
            },
            new go.Binding("text").makeTwoWay())
        );

        myDiagram.nodeTemplateMap.add("stack",
        $(go.Node, "Auto",
        {
          locationSpot: go.Spot.Top
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          { background: "#F1F1F1" },
          // Panel para contener los elementos de la pila
          $(go.Panel, "Vertical",
              // Flecha que indica el elemento superior de la pila
              $(go.Shape, "TriangleDown",
                { width: 20, height: 10, margin: 2, fill: "white", stroke: "#333333" },
                new go.Binding("visible", "stack", function(s) { return s.length > 0; })),
              // Elementos de la pila representados como rectángulos
              $(go.Panel, "Vertical",
              new go.Binding("itemArray", "stack", function(stack) { return stack.slice().reverse(); }),
                {
                  itemTemplate:
                  $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle", { width: 60, height: 20, margin: 2, fill: "white" }),
                    $(go.TextBlock, new go.Binding("text", ""))
                  )
                }
              )
            )
          )
        );

      // unlike the normal selection Adornment, this one includes a Button
      myDiagram.nodeTemplate.selectionAdornmentTemplate =
        $(go.Adornment, "Spot",
          $(go.Panel, "Auto",
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),new go.Binding("fill", "color"),
            $(go.Placeholder)  // a Placeholder sizes itself to the selected Node
          ),
          // the button to create a "next" node, at the top-right corner
          $("Button",
            {
              alignment: go.Spot.TopRight,
              click: addNodeAndLink  // this function is defined below
            },
            $(go.Shape, "PlusLine", { width: 6, height: 6 })
          ) // end button
        ); // end Adornment

        myDiagram.nodeTemplateMap.add("Start",
        $(go.Node, "Spot", { desiredSize: new go.Size(75, 75) },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, "Circle",
            {
              name: "SHAPE",
              fill: "white",
              strokeWidth: 2,
              stroke: "black",
              portId: "",
              fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
              toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
              cursor: "pointer"
            }),
            $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(65, 65), strokeWidth: 0, stroke: "black" }),
          $(go.TextBlock, "q0",
            {
              font: "bold 16pt helvetica, bold arial, sans-serif",
              stroke: "black"
              
            })
        )
      );


      myDiagram.nodeTemplateMap.add("accept",
      $(go.Node, "Spot",
      {
        locationSpot: go.Spot.Top,
        isShadowed: true, shadowBlur: 1,
        shadowOffset: new go.Point(0, 1),
        shadowColor: "rgba(0, 0, 0, .14)",
        desiredSize: new go.Size(75, 75)
      }, 
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      // define the node's outer shape, which will surround the TextBlock
      $(go.Shape, "Circle",
        {
          name: "SHAPE",
          fill: "white", 
          strokeWidth: 2,
          stroke: "black",
          portId: "",  // this Shape is the Node's port, not the whole Node
          fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
          toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
          cursor: "pointer"
        }),
        $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(60, 60), strokeWidth: 2, stroke: "black"}),
      $(go.TextBlock,
        {
          font: "bold 11pt helvetica, bold arial, sans-serif", margin: 2, stroke: "rgba(0, 0, 0, .87)",
          editable: false  // editing the text automatically updates the model data
        },
        new go.Binding("text").makeTwoWay())
    ));

    myDiagram.nodeTemplateMap.add("op",
    $(go.Node, "Spot",
    {
      locationSpot: go.Spot.Top,
      isShadowed: true, shadowBlur: 1,
      shadowOffset: new go.Point(0, 1),
      shadowColor: "rgba(0, 0, 0, .14)",
      desiredSize: new go.Size(75, 75)
    }, 
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    // define the node's outer shape, which will surround the TextBlock
    $(go.Shape, "Circle",
      {
        fill: null, 
        strokeWidth: 0,
        stroke: "black",
        portId: "",  // this Shape is the Node's port, not the whole Node
        fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
        cursor: "pointer"
      }),
      $(go.Shape, "Circle", { fill: null, desiredSize: new go.Size(60, 60), strokeWidth: 0, stroke: "black"}),
    $(go.TextBlock,
      {
        font: "bold small-caps 11pt helvetica, bold arial, sans-serif", margin: 2, stroke: "rgba(0, 0, 0, .87)",
        editable: false  // editing the text automatically updates the model data
      },
      new go.Binding("text").makeTwoWay())
  ));

      // clicking the button inserts a new node to the right of the selected node,
      // and adds a link to that new node
      function addNodeAndLink(e, obj) {
        var adornment = obj.part;
        var diagram = e.diagram;
        diagram.startTransaction("Add State");

        // get the node data for which the user clicked the button
        var fromNode = adornment.adornedPart;
        var fromData = fromNode.data;
        // create a new "State" data object, positioned off to the right of the adorned Node
        var toData = { text: "new" };
        var p = fromNode.location.copy();
        p.x += 200;
        toData.loc = go.Point.stringify(p);  // the "loc" property is a string, not a Point object
        // add the new node data to the model
        var model = diagram.model;
        model.addNodeData(toData);

        // create a link data from the old node data to the new node data
        var linkdata = {
          from: model.getKeyForNodeData(fromData),  // or just: fromData.id
          to: model.getKeyForNodeData(toData),
          text: "transition"
        };
        // and add the link data to the model
        model.addLinkData(linkdata);

        // select the new Node
        var newnode = diagram.findNodeForData(toData);
        diagram.select(newnode);

        diagram.commitTransaction("Add State");

        // if the new node is off-screen, scroll the diagram to show the new node
        diagram.scrollToRect(newnode.actualBounds);
      }

      // replace the default Link template in the linkTemplateMap
      myDiagram.linkTemplateMap.add("link2",
      $(go.Link,
        { curve: go.Link.Bezier, curviness: 20 },
        $(go.Shape,  { name: "link9", strokeWidth: 2, stroke: "black" }),
        $(go.Shape, { name: "toArrow", toArrow: "OpenTriangle", fill: null }),
        $(go.Panel, "Vertical",
          $(go.Shape, "Rectangle", { width: 60, height: 30, margin: 1, fill: "rgba(255, 255, 255, 0)", stroke: "rgba(255, 255, 255, 0)" }),
      $(go.Panel, "Vertical",
      new go.Binding("itemArray", "pila", function(stack) { return stack.slice().reverse(); }),
      
        {
          itemTemplate:
          $(go.Panel, "Auto",
            $(go.Shape, "Rectangle", { width: 60, height: 10, margin: 1, fill: "rgba(255, 255, 255, 0)", stroke: "rgba(255, 255, 255, 0)" }),
            $(go.TextBlock, new go.Binding("text", ""))
          )
        }
      )
      )
      ));
      myDiagram.linkTemplateMap.add("link3",
      $(go.Link,
        { curve: go.Link.Bezier, curviness: 20 },
        $(go.Shape,  { name: "link9", strokeWidth: 2, stroke: "black" }),
        $(go.Shape, { name: "toArrow", toArrow: "OpenTriangle", fill: null }),
        $(go.Panel, "Vertical",
          $(go.Shape, "Rectangle", { width: 60, height: 30, margin: 1, fill: "rgba(255, 255, 255, 0)", stroke: "rgba(255, 255, 255, 0)" }),
      $(go.Panel, "Vertical",
      new go.Binding("itemArray", "pila", function(stack) { return stack.slice().reverse(); }),
      
        {
          itemTemplate:
          $(go.Panel, "Auto",
            $(go.Shape, "Rectangle", { width: 60, height: 10, margin: 1, fill: "rgba(255, 255, 255, 0)", stroke: "rgba(255, 255, 255, 0)" }),
            $(go.TextBlock, new go.Binding("text", ""))
          )
        }
      )
      )
      ));

      myDiagram.linkTemplate =
      $(go.Link,
        { curve: go.Link.Bezier, curviness: 20 },
        $(go.Shape,  { name: "link9", strokeWidth: 2, stroke: "black" }),
        $(go.Shape, { name: "toArrow", toArrow: "OpenTriangle", fill: null }),
        $(go.Panel, "Vertical",
          $(go.Shape, "Rectangle", { width: 60, height: 80, margin: 1, fill: "rgba(255, 255, 255, 0)", stroke: "rgba(255, 255, 255, 0)" }),
      $(go.Panel, "Vertical",
      new go.Binding("itemArray", "pila", function(stack) { return stack.slice().reverse(); }),
      
        {
          itemTemplate:
          $(go.Panel, "Auto",
            $(go.Shape, "Rectangle", { width: 60, height: 10, margin: 1, fill: "rgba(255, 255, 255, 0)", stroke: "rgba(255, 255, 255, 0)" }),
            $(go.TextBlock, new go.Binding("text", ""))
          )
        }
      )
      )
        );



        

      
      // read in the JSON data from the "mySavedModel" element
      load();

    }
    

    // Show the diagram's model in JSON format
    function save() {
      document.getElementById("mySavedModel").value = myDiagram.model.toJson();
      myDiagram.isModified = false;
    }
    function load() {
      myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
      myDiagram.isReadOnly = true;
    }

    window.addEventListener('DOMContentLoaded', init);

    