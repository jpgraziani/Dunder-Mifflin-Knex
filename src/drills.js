require('dotenv').config()
const knex = require('knex');
const { restart } = require('nodemon');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})
//--------------------------------------------------
//--------------------------------------------------
function searchByItemName(searchTerm) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILike', `%${searchTerm}%`)
    .then(result => {
      console.log('SEARCH TERM', { searchTerm })
      console.log(result)
    })
}

searchByItemName('burger')

//--------------------------------------------------
//--------------------------------------------------
function paginateItems(pageNum) {
  const limit = 6
  const offset = limit * (pageNum - 1)
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(limit)
    .offset(offset)
    .then(results => {
      console.log('PAGINATE ITEMS', { pageNum })
      console.log(results)
    })
}

paginateItems(3);

//--------------------------------------------------
//--------------------------------------------------
function productsAddedDaysAgo(daysAgo) {
  knexInstance
    .select('id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where(
      'date_added', '>',
      knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
    )
    .then(results => {
      console.log('PRODUCT ADDED DAYS AGO')
      console.log(results);
    })
}

productsAddedDaysAgo(5)

//--------------------------------------------------
//--------------------------------------------------
function costPerCategory() {
  knexInstance('shopping_list')
    .select('category')
    // .sum('price as total')
    .count('name As items')
    .sum('price AS total')
    .select(knexInstance.raw('ROUND(AVG(PRICE), 2) AS average'))
    // .from('shopping_list')
    .groupBy('category')
    .then(results => {
      console.log(results)
    })
}

costPerCategory()