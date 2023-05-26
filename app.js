
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
mongoose.connect("mongodb+srv://jesusCode:jesusCode@cluster0.legj65k.mongodb.net/todolistDB", {useNewUrlParser : true});
// mongoose.set('debug', true);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// variable declaration 

// Database Model

const itemsSchema = new mongoose.Schema({
  name: String
});

const Items =  mongoose.model("item", itemsSchema);

const listsSchema = new mongoose.Schema({
      name : String,
      list : [itemsSchema]
});

const List = mongoose.model("list",listsSchema);

// End of Database Model


// default array
  let item1 = {
    name : "Hola"
  }
  let item2 = {
    name : "Zomana"
  }
  let item3 = {
    name : "Hurray"
  }

// end of default array
app.get("/", function(req, res) {
  
Items.find()
  .then((docs) => {
    res.render("list", { listTitle: "Today", newListItems: docs });
  })
  .catch((err) => console.log(err));
});

app.post("/", function(req, res){

  const {newItem : value, list: listName} = req.body;
  let item = new Items(
    {name : value}
  );
  
  if(listName == "Today"){
    if (value.trim() != "") {
      item.save();
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  }else{
    // This branch is in charge of undate the List model
    List.findOneAndUpdate({name : listName}, {$push : {list : item}}).then(
    ).catch(err => console.log(err))
    res.redirect(`/${listName}`);
  }
 
}
);

app.post('/delete', (req,res) => {
  //  Object destructing
  const { checkbox, list: listName } =  req.body;
  if(listName == "Today"){
    Items.findByIdAndRemove(checkbox)
      .then()
      .catch((err) => console.log(err));
    res.redirect("/");
  }else{
    List.findOneAndUpdate({name : listName}, {$pull : {list : {_id : checkbox}}}).catch(err => console.log(err));
    res.redirect(`/${listName}`);
  }
})

app.get('/:plan', (req,res) => {

      const plan = _.capitalize(req.params.plan);
      List.findOne({name : plan}).then(
        docs => {
          if(docs != null){
            
            const {list} = docs;
            res.render("list", {listTitle: plan, newListItems: list});
          }else{
            List.create({
              name: plan,
              list: [item1, item2, item3],
            }).then();

            res.redirect(`/${plan}`);
          }
        }
      )
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});