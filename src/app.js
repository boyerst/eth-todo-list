App = {
   load: async () => {
    //Load app...
    //Async await patterns good for loading data from the blockchain
    console.log("app loading...")
   }

}   

$(() => {
  $(window).load(() => {
    App.load()  
  })
})