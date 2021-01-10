require('dotenv').config()
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

console.log('knex and driver installed correctly');

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//this part was practice

knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  .first() //this only selects first found & will take it out of the array
  .then(result => {
    console.log(result)
  })

  const qry = knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where({ name: 'Point of view gun' })
    .first() //this only selects first found & will take it out of the array. however if you do toQuery it takes it out and you dont need .first
    .toQuery()

    console.log(qry)


//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
//setting the specific search querires as functions to reuse.

  function searchByProduceName(searchTerm) {
    knexInstance
      .select('product_id', 'name', 'price', 'category')
      .from('amazong_products')
      .where( 'name', 'ILIKE', `%${searchTerm}%`)
      .then(result => {
        console.log(result)
      })
  }
    
  searchByProduceName('holo')

  function paginateProducts(page) {
    const productsPerPage = 10;
    const offset = productsPerPage * (page - 1)

    knexInstance
      .select('product_id', 'name', 'price', 'category')
      .from('amazong_products')
      .limit(productsPerPage)
      .offset(offset)
      .then(results => {
        console.log(results)
      })
  }

  paginateProducts(2)

  function getProductsWithImages() {
    knexInstance
      .select('product_id', 'name', 'price', 'category')
      .from('amazong_products')
      .whereNotNull('image')
      .then(results => {
        console.log(results)
      })
  }

  getProductsWithImages()

  function mostPopularVideosForDays(days) {
    knexInstance
      .select('video_name', 'region')
      .count('date_viewed As views')
      .where(
        'date_viewed',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
      )
      .from('whopipe_video_views')
      .groupBy('video_name', 'region')
      .orderBy([
        { column: 'region', order: 'ASC' },
        { column: 'views', order: 'DESC'},
      ])
      .then(results => {
        console.log(results)
      })
  }

  mostPopularVideosForDays(30)

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------