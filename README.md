# Musicality

---

Name: Albert Chu, Perri Smith, Tsipora Stone

Date: 12/06/19

Project Topic: Album Reviews

URL: https://musicality389.herokuapp.com/

GitHub URL: https://github.com/thechuster/CMSC389KFinalProject 

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`:     artist       `Type: string`
- `Field 2`:     title       `Type: string`
- `Field 3`:     year       `Type: Number`
- `Field 4`:     genre       `Type: string`
- `Field 5`:     picURL       `Type: string`
- `Field 6`:     reviews       `Type: array`

Schema: 
```javascript
{
   var reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0.0,
        max: 5.0,
        required: true
    },
    comment: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

var albumSchema = new mongoose.Schema({
    artist: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        min: 0,
        max: 2019,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    PicURL: {
        type: String
    },
    reviews: [reviewSchema]
});
}
```

### 2. Live Updates

Live updates come from sockets which we use to create a notification system that notifies the user of new reviews that are posted to the site

HTML form route: `/notifications`

### 3. View Data

GET endpoint route: `/`
GET api endpoint route: `/api/album`

Navigation Filters
1. Home -> `  /  `
2. Genres -> `  /genres  `
3. Artists -> `  /artists  `
4. Submit -> `  /submit  `
5. Group Members -> `  /members  `

### 4. API

GET endpoint routes:
1. displays list of all genres -> ` /genres `
2. displays list of albums under that genre -> ` /genre/:genre `
3. displays list of all artists -> ` /artists `
4. displays list of albums under a specific artist -> ` /artist/:artist `
5. gets all albums stored in database -> ` /api/album `
6. get all reviews for a specific album -> ` /api/album/:id/reviews `

POST endpoint routes:
1. post an album to the database -> `/api/add_album `
2. post a review to a specific album -> `/api/album/:id/review `

DELETE endpoint routes:
1. delete an album based off of its mongodb id -> `/api/album/:id `
2. delete an album based off of the album name -> `/api/delete_album/:album `

### 5. Modules

Modules
1. average -> takes the average of the ratings
2. test -> to test the functionality of the website

### 6. NPM Packages
1. colors
2. one-liner-joke

### 7. User Interface

css files
1. main.css
2. font-awesome.min.css

### 8. Deployment

URL: https://musicality389.herokuapp.com/