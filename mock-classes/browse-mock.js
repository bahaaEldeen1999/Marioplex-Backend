 const MockCategory = {

     getCategoryById: function(categoryId) {
         for (let i = 0; i < this.catgories.length; i++) {
             if (this.catgories[i]._id == categoryId) {
                 return this.catgories[i];
             }
         }
         return 0;

     },

     getCategories: function() {
         if (this.catgories.length == 0) return 0;
         else return this.catgories;
     }
 }
 module.exports = MockCategory