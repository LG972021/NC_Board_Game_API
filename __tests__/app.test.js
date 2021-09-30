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
    expect(response.body.hasOwnProperty("message")).toBe(true);
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
  test("200 : Responds wtih object with key reviews : value array of review objects", async () => {
    const response = await request(app).get("/api/reviews").expect(200);
    expect(response.body.hasOwnProperty("reviews")).toBe(true);
    expect(Array.isArray(response.body.reviews)).toBe(true);
  });

  test("200 : Responce array should contain objects with corrrect properties of the correct data types.", async () => {
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
        comment_count: expect.any(Number),
      });
    });
  });

  test("200 : By Default, returned object is organsied by created_by in DESC order, but returns error if neither ASC or DESC is used for order", async () => {
    let response = await request(app).get("/api/reviews").expect(200);
    expect(response.body.reviews).toBeSortedBy("created_at", {
      descending: true,
    });
    response = await request(app)
      .get("/api/reviews?order=whateverorderIsay")
      .expect(400);
    expect(response.body.msg).toBe("Cannot sort in that order");
  });

  test("200 : Functionality in place to order reviews in returned object by one of its properties (ASC or DESC order) .", async () => {
    let response = await request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200);
    expect(response.body.reviews).toBeSortedBy("votes", {
      descending: true,
    });

    response = await request(app)
      .get("/api/reviews?sort_by=votes&order=ASC")
      .expect(200);
    expect(response.body.reviews).toBeSortedBy("votes", {
      descending: false,
    });

    response = await request(app).get("/api/reviews?sort_by=owner").expect(200);
    expect(response.body.reviews).toBeSortedBy("owner", {
      descending: true,
    });

    response = await request(app)
      .get("/api/reviews?sort_by=owner&&order=ASC")
      .expect(200);
    expect(response.body.reviews).toBeSortedBy("owner", {
      descending: false,
    });
  });

  test("200 : Functionality in place to filter reviews in returned object by a specific category (ASC or DESC order) .", async () => {
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
        comment_count: 3,
      },
    ]);
    expect(response.body.reviews.length).toEqual(1);

    response = await request(app)
      .get("/api/reviews?cat=social deduction")
      .expect(200);
    expect(response.body.reviews).toBeSortedBy("created_at", {
      descending: true,
    });
    expect(response.body.reviews.length).toEqual(11);

    response = await request(app)
      .get("/api/reviews?cat=social deduction&order=ASC")
      .expect(200);
    expect(response.body.reviews).toBeSortedBy("created_at", {
      descending: false,
    });
    expect(response.body.reviews.length).toEqual(11);
  });

  test("200 : Functionality in place to Both Sort response by one of it's property's and filter reviews in returned object by a specific category (ASC or DESC) .", async () => {
    let response = await request(app)
      .get("/api/reviews?sort_by=title&&order=ASC&&cat=dexterity")
      .expect(200);

    expect(response.body.reviews).toBeSortedBy("title", {
      descending: false,
    });
    expect(response.body.reviews.length).toEqual(1);

    response = await request(app)
      .get("/api/reviews?sort_by=title&&order=ASC&&cat=social deduction")
      .expect(200);
    expect(response.body.reviews).toBeSortedBy("title", {
      descending: false,
    });
    expect(response.body.reviews.length).toEqual(11);
  });

  test("400 : Responds wtih object with key msg : value error message when queried with an unusable sort_by", async () => {
    let response = await request(app)
      .get("/api/reviews?sort_by=whatamIevendoing")
      .expect(400);
    expect(response.body.hasOwnProperty("msg")).toBe(true);
    expect(response.body.msg).toBe("Cannot sort by that collum");

    response = await request(app)
      .get("/api/reviews?sort_by=WhoKnows?&order=ASC")
      .expect(400);
    expect(response.body.hasOwnProperty("msg")).toBe(true);
    expect(response.body.msg).toBe("Cannot sort by that collum");
  });

  test("400 : Responds wtih object with key msg : value error message when queried with an unusable sort_by", async () => {
    let response = await request(app)
      .get("/api/reviews?order=cantUseThis")
      .expect(400);
    expect(response.body.hasOwnProperty("msg")).toBe(true);
    expect(response.body.msg).toBe("Cannot sort in that order");

    response = await request(app)
      .get("/api/reviews?sort_by=WhoKnows?&order=cantUseThisASC")
      .expect(400);
    expect(response.body.hasOwnProperty("msg")).toBe(true);
    expect(response.body.msg).toBe("Cannot sort in that order");
  });

  test("404 : Responds wtih object with key msg : value error message when queried with an unusable category", async () => {
    let response = await request(app)
      .get("/api/reviews?cat=whatamIevendoing")
      .expect(404);
    expect(response.body.hasOwnProperty("msg")).toBe(true);
    expect(response.body.msg).toBe("Cannot filter by that category");

    response = await request(app)
      .get("/api/reviews?sort_by=dexterity&cat=whatamIevendoing")
      .expect(404);
    expect(response.body.hasOwnProperty("msg")).toBe(true);
    expect(response.body.msg).toBe("Cannot filter by that category");
  });

  test("200 : Responds wtih object with key reviews : value empty array where queried category is valid but yields no reviews", async () => {
    const response = await request(app)
      .get("/api/reviews?cat=engine-building")
      .expect(200);
    expect(response.body.hasOwnProperty("reviews")).toBe(true);
    expect(response.body.reviews.length).toBe(0);
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

  test("400 : Returns Error Message when path an unusable review ID", async () => {
    let response = await request(app)
      .get("/api/reviews/TestString1")
      .expect(400);
    expect(response.body.hasOwnProperty("message")).toBe(true);
    expect(response.body.message).toBe("Bad Request");

    response = await request(app).get("/api/reviews/TestString").expect(400);
    expect(response.body.hasOwnProperty("message")).toBe(true);
    expect(response.body.message).toBe("Bad Request");
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  const inpuctObjInc1 = { inc_votes: 1 };
  const inpuctObjInc2 = { inc_votes: -1 };
  const inpuctObjInc3 = { inc_votes: -100 };
  const brokenInpuctObjInc1 = { inc_votes: "this isn't right" };
  const brokenInpuctObjInc2 = { inc_votes: true };
  const brokenInpuctObjInc3 = { inc_votes: "teststring1" };

  test("200 : Responds wtih object", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc1)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(typeof response.body.review).toBe("object");
  });

  test("200 : Responds wtih object with corrrect properties of the correct data type.", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc1)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.hasOwnProperty("review")).toBe(true);

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
    });
  });

  test("200 : Responds wtih object with key updatedReview : value patchedReview Object ", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc1)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.review).toEqual({
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
    expect(response.body.review.votes).toBe(6);
  });

  test("200 : Returned Object's votes property is returned REDUCED by 1 when input object's inc_votes is -1", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc2)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.review.votes).toBe(4);
  });

  test("200 : Returned Object's votes property is returned REDUCED by 100 when input object's inc_votes is -100", async () => {
    const response = await request(app)
      .patch("/api/reviews/2")
      .send(inpuctObjInc3)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.review.votes).toBe(-95);
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

  test("400 : Returns Error Message when path uses unusable review_id", async () => {
    let response = await request(app)
      .patch("/api/reviews/teststring")
      .send(inpuctObjInc1)
      .expect(400);
    expect(response.body).toEqual({
      message: `Bad Request`,
    });

    response = await request(app)
      .patch("/api/reviews/teststring1")
      .send(inpuctObjInc1)
      .expect(400);
    expect(response.body).toEqual({
      message: `Bad Request`,
    });
  });

  test("400 : Returns Error Message when sending an unusable amount to increment votes by", async () => {
    let response = await request(app)
      .patch("/api/reviews/2")
      .send(brokenInpuctObjInc1)
      .expect(400);
    expect(response.body).toEqual({
      message: `Bad Request`,
    });

    response = await request(app)
      .patch("/api/reviews/1")
      .send(brokenInpuctObjInc1)
      .expect(400);
    expect(response.body).toEqual({
      message: `Bad Request`,
    });

    response = await request(app)
      .patch("/api/reviews/2")
      .send(brokenInpuctObjInc2)
      .expect(400);
    expect(response.body).toEqual({
      message: `Bad Request`,
    });

    response = await request(app)
      .patch("/api/reviews/2")
      .send(brokenInpuctObjInc3)
      .expect(400);
    expect(response.body).toEqual({
      message: `Bad Request`,
    });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200 : Responds wtih object with key comments : value Array of comments for the review matching ID param", async () => {
    let response = await request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.hasOwnProperty("comments")).toBe(true);
    expect(response.body.comments.length).toBe(3);

    response = await request(app)
      .get("/api/reviews/2")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.review.comment_count).toBe(3);

    response = await request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.comments.length).toBe(3);

    response = await request(app)
      .get("/api/reviews/3")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.review.comment_count).toBe(3);
  });

  test("200 : Elements in Array of Reviews should have correct properties and data types", async () => {
    const response = await request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    response.body.comments.forEach((comment) => {
      expect(comment).toMatchObject({
        body: expect.any(String),
        author: expect.any(String),
        review_id: expect.any(Number),
        created_at: expect.any(String),
      });
    });
  });

  test("200 : comment should be an empty array if review ID yields review with no comments", async () => {
    const response = await request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.comments.length).toBe(0);
    expect(response.body.comments).toEqual([]);
  });

  test("404 : Should respond with an error message when using a valid id with no review", async () => {
    let response = await request(app)
      .get("/api/reviews/2000/comments")
      .expect(404)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.hasOwnProperty("msg")).toBe(true);
    expect(response.body.msg).toBe("No review with that ID currently");
  });

  test("400 : Should respond with an error message when using an unuable review id", async () => {
    let response = await request(app)
      .get("/api/reviews/noReviewHere/comments")
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.hasOwnProperty("message")).toBe(true);
    expect(response.body.message).toBe("Bad Request");

    response = await request(app)
      .get("/api/reviews/no Review Here/comments")
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.hasOwnProperty("message")).toBe(true);
    expect(response.body.message).toBe("Bad Request");

    response = await request(app)
      .get("/api/reviews/no1 Review2 Here3/comments")
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.hasOwnProperty("message")).toBe(true);
    expect(response.body.message).toBe("Bad Request");
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("200 : Responds wtih object with key posted_review : value comment object ", async () => {
    const inputComment = {
      username: "dav3rid",
      body: "This is the body of the test review",
    };

    const response = await request(app)
      .post("/api/reviews/2/comments")
      .send(inputComment)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(typeof response.body.comment).toBe("object");
  });

  test("200 : Comment object should contain correct properties of the correct datatypes", async () => {
    const inputComment = {
      username: "dav3rid",
      body: "This is the body of the test comment",
    };

    const response = await request(app)
      .post("/api/reviews/2/comments")
      .send(inputComment)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.hasOwnProperty("comment")).toBe(true);

    expect(response.body.comment).toMatchObject({
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
      body: "This is the body of the test comment",
    };

    let response = await request(app)
      .post("/api/reviews/2/comments")
      .send(inputCommnet)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.comment).toEqual({
      comment_id: 7,
      body: "This is the body of the test comment",
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
    expect(response.body.comment).toEqual({
      comment_id: 8,
      body: "This is the body of the test comment",
      votes: 0,
      author: "dav3rid",
      review_id: 1,
      created_at: expect.any(String),
    });
  });

  test("200 : Succesfully posting comment should increment the comment count of the review ID's review", async () => {
    const inputComment = {
      username: "dav3rid",
      body: "This is the body of the test review",
    };

    let response = await request(app)
      .post("/api/reviews/2/comments")
      .send(inputComment)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(typeof response.body.comment).toBe("object");

    response = await request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.comments.length).toBe(4);

    response = await request(app)
      .get("/api/reviews/2")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.review.comment_count).toBe(4);
  });

  test("400 : Responds wtih 400 and error message when using a unusable review ID ", async () => {
    const inputCommnet = {
      username: "dav3rid",
      body: "This is the body of the test comment",
    };

    let response = await request(app)
      .post("/api/reviews/WhatevenIsThis/comments")
      .send(inputCommnet)
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.hasOwnProperty("message")).toBe(true);
    expect(response.body.message).toBe("Bad Request");

    response = await request(app)
      .post("/api/reviews/otherReview1/comments")
      .send(inputCommnet)
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.hasOwnProperty("message")).toBe(true);
    expect(response.body.message).toBe("Bad Request");
  });

  test("404 : Responds wtih 404 and error message when username isn't on list of users", async () => {
    const inputCommnet = {
      username: "invalidUserName",
      body: "This is the body of the test comment",
    };

    const response = await request(app)
      .post("/api/reviews/2/comments")
      .send(inputCommnet)
      .expect(404)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.msg).toBe("Unable to locate Review or Username");
  });

  test("400 : Responds wtih 404 and error message, when input object is missing an element", async () => {
    const BadInputComment1 = {
      username: "dav3rid",
    };

    const BadInputComment2 = {
      body: "This is the body of the test comment",
    };

    let response = await request(app)
      .post("/api/reviews/1/comments")
      .send(BadInputComment1)
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.msg).toBe("Missing an essential element of comment");

    response = await request(app)
      .post("/api/reviews/1/comments")
      .send(BadInputComment2)
      .expect(400)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.msg).toBe("Missing an essential element of comment");
  });

  test("201 : Retruned posted comment should only contain author and body, even if additional superfluous elements are provided in input object", async () => {
    const TMIInputComment1 = {
      username: "dav3rid",
      body: "This is the body of the test comment",
      trivia: "This is some comment trivia",
    };

    const TMIInputComment2 = {
      username: "dav3rid",
      body: "This is the body of the test comment2",
      trivia: "This is some comment trivia",
      randomNumber: 0,
    };

    let response = await request(app)
      .post("/api/reviews/1/comments")
      .send(TMIInputComment1)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.comment).toMatchObject({
      comment_id: expect.any(Number),
      body: expect.any(String),
      votes: expect.any(Number),
      author: expect.any(String),
      review_id: expect.any(Number),
      created_at: expect.any(String),
    });

    expect(response.body.comment).toEqual({
      comment_id: 7,
      body: "This is the body of the test comment",
      votes: 0,
      author: "dav3rid",
      review_id: 1,
      created_at: expect.any(String),
    });

    expect(response.body.comment.hasOwnProperty("trivia")).toBe(false);

    response = await request(app)
      .post("/api/reviews/1/comments")
      .send(TMIInputComment2)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.body.comment).toMatchObject({
      comment_id: expect.any(Number),
      body: expect.any(String),
      votes: expect.any(Number),
      author: expect.any(String),
      review_id: expect.any(Number),
      created_at: expect.any(String),
    });

    expect(response.body.comment).toEqual({
      comment_id: 8,
      body: "This is the body of the test comment2",
      votes: 0,
      author: "dav3rid",
      review_id: 1,
      created_at: expect.any(String),
    });

    expect(response.body.comment.hasOwnProperty("trivia")).toBe(false);
    expect(response.body.comment.hasOwnProperty("randomNumber")).toBe(false);
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
