const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/hello", () => {
  test('200 : Responds wtih object with key msg : value "Hello" ', async () => {
    const response = await request(app)
      .get("/api/hello")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.message).toBe("Hello there");
  });
});

describe("GET unusablePathName", () => {
  test('Unusable Path in API Router <<< 404 : Responds wtih object with key message : value "No Results for this Path" ', async () => {
    const response = await request(app).get("/api/randomPathName").expect(404);
    expect(response.body.message).toBe("No Results for this Path");

    const response1 = await request(app).get("/api/abcdefg").expect(404);
    expect(response1.body.message).toBe("No Results for this Path");
  });

  test('Unusable Path <<< 404 : Responds wtih object with key message : value "No Results for this Path" ', async () => {
    const response = await request(app).get("/randomPathName").expect(404);
    expect(response.body.message).toBe("No Results for this Path");

    const response1 = await request(app)
      .get("/Scooby-Doo, where are you?")
      .expect(404);
    expect(response1.body.message).toBe("No Results for this Path");
  });

  test('Misspelled Path <<< 404 : Responds wtih object with key message : value "No Results for this Path" ', async () => {
    const response = await request(app).get("/api/categeries").expect(404);
    expect(response.body.message).toBe("No Results for this Path");

    const response1 = await request(app).get("/apo/categories").expect(404);
    expect(response1.body.message).toBe("No Results for this Path");

    const response2 = await request(app).get("/apo").expect(404);
    expect(response2.body.message).toBe("No Results for this Path");
  });
});

describe("GET /api/categories", () => {
  test("200 : Responds wtih object with key categories : value Array of category object", async () => {
    const response = await request(app)
      .get("/api/categories")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(typeof response.body.categories).toBe("object");
    expect(Array.isArray(response.body.categories)).toBe(true);
  });

  test("200 : Array of category objects should be same length as number of category entries in DB", async () => {
    const response = await request(app)
      .get("/api/categories")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.categories.length).toBe(4);
  });

  test("200 : Category objects in the array should have a property of 'description' and 'slug'", async () => {
    const response = await request(app)
      .get("/api/categories")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    response.body.categories.forEach((category) => {
      expect(category.hasOwnProperty("description")).toBe(true);
      expect(category.hasOwnProperty("slug")).toBe(true);
      expect(category.hasOwnProperty("title")).toBe(false);
    });
  });
});

describe("GET /api/reviews", () => {
  test("200 : Responds wtih object with key reviews : value review objects", async () => {
    const response = await request(app).get("/api/reviews").expect(200);
    expect(response.body.hasOwnProperty("reviews")).toBe(true);
  });

  test("200 : Responds wtih objects with corrrect properties of the correct data types.", async () => {
    const response = await request(app).get("/api/reviews").expect(200);

    response.body.reviews.forEach((review) => {
      expect(review).toMatchObject({
        owner: expect.any(String),
        title: expect.any(String),
        review_id: expect.any(Number),
        review_body: expect.any(String),
        designer: expect.any(String),
        review_img_url: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      });
    });
  });

  test("200 : By Default, returned object is organsied by created_by in DESC order.", async () => {
    let response = await request(app).get("/api/reviews").expect(200);
    expect(response.body.reviews[0]).toEqual({
      review_id: 7,
      title: "Mollit elit qui incididunt veniam occaecat cupidatat",
      review_body:
        "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
      designer: "Avery Wunzboogerz",
      review_img_url:
        "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      votes: 9,
      category: "social deduction",
      owner: "mallionaire",
      created_at: "2021-01-25T11:16:54.963Z",
    });
    expect(response.body.reviews[1]).toEqual({
      review_id: 4,
      title: "Dolor reprehenderit",
      review_body:
        "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
      designer: "Gamey McGameface",
      review_img_url:
        "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      votes: 7,
      category: "social deduction",
      owner: "mallionaire",
      created_at: "2021-01-22T11:35:50.936Z",
    });
  });

  test("200 : Functionality in place to order reviews in returned object by one of its properties (ASC or DESC) .", async () => {
    let response = await request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200);
    expect(response.body.reviews[0]).toEqual({
      review_id: 12,
      title: "Scythe; you're gonna need a bigger table!",
      review_body:
        "Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.",
      designer: "Jamey Stegmaier",
      review_img_url:
        "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
      votes: 100,
      category: "social deduction",
      owner: "mallionaire",
      created_at: "2021-01-22T10:37:04.839Z",
    });
    expect(response.body.reviews[1]).toEqual({
      review_id: 13,
      title: "Settlers of Catan: Don't Settle For Less",
      review_body:
        "You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.",
      designer: "Klaus Teuber",
      review_img_url:
        "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
      votes: 16,
      category: "social deduction",
      owner: "mallionaire",
      created_at: "1970-01-10T03:08:38.400Z",
    });

    response = await request(app)
      .get("/api/reviews?sort_by=votes&order=ASC")
      .expect(200);
    expect(response.body.reviews[0]).toEqual({
      review_id: 1,
      title: "Agricola",
      review_body: "Farmyard fun!",
      designer: "Uwe Rosenberg",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      votes: 1,
      category: "euro game",
      owner: "mallionaire",
      created_at: "2021-01-18T10:00:20.514Z",
    });

    response = await request(app).get("/api/reviews?sort_by=owner").expect(200);
    expect(response.body.reviews[0].owner).toBe("philippaclaire9");

    response = await request(app)
      .get("/api/reviews?sort_by=owner&&order=ASC")
      .expect(200);
    expect(response.body.reviews[0].owner).toBe("bainesface");
  });

  test("200 : Functionality in place to filter reviews in returned object by a specific category (ASC or DESC) .", async () => {
    let response = await request(app)
      .get("/api/reviews?cat=dexterity")
      .expect(200);
    expect(response.body.reviews).toEqual([
      {
        review_id: 2,
        title: "Jenga",
        review_body: "Fiddly fun for all the family",
        designer: "Leslie Scott",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        votes: 5,
        category: "dexterity",
        owner: "philippaclaire9",
        created_at: "2021-01-18T10:01:41.251Z",
      },
    ]);
    expect(response.body.reviews.length).toEqual(1);

    response = await request(app)
      .get("/api/reviews?cat=social deduction")
      .expect(200);

    expect(response.body.reviews.length).toEqual(11);
  });

  test("200 : Functionality in place to Both Sort response by one of it's property's and filter reviews in returned object by a specific category (ASC or DESC) .", async () => {
    let response = await request(app)
      .get("/api/reviews?sort_by=title&&order=ASC&&cat=dexterity")
      .expect(200);
    expect(response.body.reviews[0]).toEqual({
      review_id: 2,
      title: "Jenga",
      review_body: "Fiddly fun for all the family",
      designer: "Leslie Scott",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      votes: 5,
      category: "dexterity",
      owner: "philippaclaire9",
      created_at: "2021-01-18T10:01:41.251Z",
    });
    expect(response.body.reviews.length).toEqual(1);

    response = await request(app)
      .get("/api/reviews?sort_by=title&&order=ASC&&cat=social deduction")
      .expect(200);
    expect(response.body.reviews[0]).toEqual({
      review_id: 9,
      title: "A truly Quacking Game; Quacks of Quedlinburg",
      review_body:
        "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
      designer: "Wolfgang Warsch",
      review_img_url:
        "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
      votes: 10,
      category: "social deduction",
      owner: "mallionaire",
      created_at: "2021-01-18T10:01:41.251Z",
    });
    expect(response.body.reviews.length).toEqual(11);
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("200 : Responds wtih object with key review : value review object", async () => {
    const response = await request(app).get("/api/reviews/2").expect(200);
    expect(response.body.hasOwnProperty("review")).toBe(true);
  });

  test("200 : Responds wtih object with corrrect properties of the correct data type.", async () => {
    const response = await request(app).get("/api/reviews/2").expect(200);

    expect(response.body.review).toMatchObject({
      owner: expect.any(String),
      title: expect.any(String),
      review_id: expect.any(Number),
      review_body: expect.any(String),
      designer: expect.any(String),
      review_img_url: expect.any(String),
      category: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      comment_count: expect.any(Number),
    });
  });

  test("200 : review object should have comment_count property, the value of which should be a number ", async () => {
    const response = await request(app).get("/api/reviews/2").expect(200);
    expect(response.body.review.hasOwnProperty("comment_count")).toBe(true);
    expect(typeof response.body.review.comment_count).toBe("number");
  });

  test("200 : review comment_count should be 0 if NO comments have the review_id of param review", async () => {
    const response = await request(app).get("/api/reviews/1").expect(200);
    expect(response.body.review.comment_count).toBe(0);
  });

  test("200 : review comment_count should be 3 if 3 comments have the review_id of param review", async () => {
    const response = await request(app).get("/api/reviews/2").expect(200);
    expect(response.body.review.comment_count).toBe(3);
  });

  test("404 : Returns Error Message when path uses Id with no associated review", async () => {
    const response = await request(app).get("/api/reviews/2000").expect(404);
    expect(response.body).toEqual({
      msg: `No review with that ID currently`,
    });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  const inpuctObjInc1 = { inc_votes: 1 };
  const inpuctObjInc2 = { inc_votes: -1 };
  const inpuctObjInc3 = { inc_votes: -100 };

  test("200 : Responds wtih object", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc1)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(typeof response.body.updatedReview).toBe("object");
  });

  test("200 : Responds wtih object with corrrect properties of the correct data type.", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc1)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.hasOwnProperty("updatedReview")).toBe(true);

    expect(response.body.updatedReview).toMatchObject({
      owner: expect.any(String),
      title: expect.any(String),
      review_id: expect.any(Number),
      review_body: expect.any(String),
      designer: expect.any(String),
      review_img_url: expect.any(String),
      category: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
    });
  });

  test("200 : Responds wtih object with key updatedReview : value patchedReview Object ", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc1)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.updatedReview).toEqual({
      review_id: 2,
      title: "Jenga",
      designer: "Leslie Scott",
      owner: "philippaclaire9",
      review_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      review_body: "Fiddly fun for all the family",
      category: "dexterity",
      created_at: expect.any(String),
      votes: 6,
    });
  });

  test("200 : Returned Object's votes property is returned INCREMENTED by 1 when input object's inc_votes is 1", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc1)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.updatedReview.votes).toBe(6);
  });

  test("200 : Returned Object's votes property is returned REDUCED by 1 when input object's inc_votes is -1", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc2)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.updatedReview.votes).toBe(4);
  });

  test("200 : Returned Object's votes property is returned REDUCED by 100 when input object's inc_votes is -100", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc3)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.updatedReview.votes).toBe(-95);
  });

  test("404 : Returns Error Message when path uses Id with no associated review", async () => {
    const response = await request(app)
      .patch("/api/reviews/2000")
      .send(inpuctObjInc3)
      .expect(404);
    expect(response.body).toEqual({
      msg: `No review with that ID currently`,
    });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200 : Responds wtih object with key review_comments : value Array of Reviews ", async () => {
    let response = await request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.review_comments.length).toBe(3);

    response = await request(app)
      .get("/api/reviews/2")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.review.comment_count).toBe(3);

    response = await request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.review_comments.length).toBe(3);

    response = await request(app)
      .get("/api/reviews/3")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.review.comment_count).toBe(3);
  });

  test("200 : Elements in Array of Reviews should have correct properties and data types", async () => {
    let response = await request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    response.body.review_comments.forEach((comment) => {
      expect(comment).toMatchObject({
        body: expect.any(String),
        author: expect.any(String),
        review_id: expect.any(Number),
        created_at: expect.any(String),
      });
    });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("200 : Responds wtih object with key posted_review : value comment object ", async () => {
    const inputCommnet = {
      username: "dav3rid",
      body: "This is the body of the test review",
    };

    const response = await request(app)
      .post("/api/reviews/2/comments")
      .send(inputCommnet)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(typeof response.body.posted_comment).toBe("object");
  });

  test("200 : Comment object should contain correct properties of the correct datatypes", async () => {
    const inputCommnet = {
      username: "dav3rid",
      body: "This is the body of the test review",
    };

    const response = await request(app)
      .post("/api/reviews/2/comments")
      .send(inputCommnet)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.hasOwnProperty("posted_comment")).toBe(true);

    expect(response.body.posted_comment).toMatchObject({
      comment_id: expect.any(Number),
      body: expect.any(String),
      votes: expect.any(Number),
      author: expect.any(String),
      review_id: expect.any(Number),
      created_at: expect.any(String),
    });
  });

  test("200 : Comment object's author and body properties should reflect the values in input object whilst incremented comment_id for new comments", async () => {
    const inputCommnet = {
      username: "dav3rid",
      body: "This is the body of the test review",
    };

    let response = await request(app)
      .post("/api/reviews/2/comments")
      .send(inputCommnet)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.posted_comment).toEqual({
      comment_id: 7,
      body: "This is the body of the test review",
      votes: 0,
      author: "dav3rid",
      review_id: 2,
      created_at: expect.any(String),
    });

    response = await request(app)
      .post("/api/reviews/1/comments")
      .send(inputCommnet)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.posted_comment).toEqual({
      comment_id: 8,
      body: "This is the body of the test review",
      votes: 0,
      author: "dav3rid",
      review_id: 1,
      created_at: expect.any(String),
    });
  });

  test("404 : Responds wtih 404 and error message when username isn't on list of users", async () => {
    const inputCommnet = {
      username: "invalidUserName",
      body: "This is the body of the test review",
    };

    let response = await request(app)
      .post("/api/reviews/2/comments")
      .send(inputCommnet)
      .expect(404)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.msg).toBe("Invalid Review_ID or Username");
  });

  test("404 : Responds wtih 404 and error message when username isn't on list of users", async () => {
    const inputCommnet = {
      username: "dav3rid",
      body: "This is the body of the test review",
    };

    let response = await request(app)
      .post("/api/reviews/1000/comments")
      .send(inputCommnet)
      .expect(404)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.msg).toBe("Invalid Review_ID or Username");
  });
});

describe("Get /api", () => {
  test("200 : Responds wtih object", async () => {
    const response = await request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(typeof response.body).toBe("object");
  });

  test("200 : Responds wtih object with keys categories of paths : values list of available paths", async () => {
    const response = await request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.Misc_Endpoints).toEqual(["/", "/hello"]);
    expect(response.body.Category_Endpoints).toBe("/");
    expect(response.body.Review_Endpoints).toEqual([
      "/",
      "/:review_id",
      "/:review_id/comments",
    ]);
  });
});
