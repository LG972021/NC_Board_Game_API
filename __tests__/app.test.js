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

  test("200 : Array of category objects should be same length as numbe of entries in DB", async () => {
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

describe("GET /api/reviews/:review_id", () => {
  test("200 : Responds wtih object with key review : value review object", async () => {
    const response = await request(app).get("/api/reviews/2").expect(200);
    expect(response.body.hasOwnProperty("review")).toBe(true);
  });

  test("200 : Responds wtih object with corrrect properties of the correct data type.", async () => {
    const response = await request(app).get("/api/reviews/2").expect(200);
    expect(response.body.review.hasOwnProperty("owner")).toBe(true);
    expect(typeof response.body.review.owner).toBe("string");

    expect(response.body.review.hasOwnProperty("title")).toBe(true);
    expect(typeof response.body.review.title).toBe("string");

    expect(response.body.review.hasOwnProperty("review_id")).toBe(true);
    expect(typeof response.body.review.review_id).toBe("number");

    expect(response.body.review.hasOwnProperty("review_body")).toBe(true);
    expect(typeof response.body.review.review_body).toBe("string");

    expect(response.body.review.hasOwnProperty("designer")).toBe(true);
    expect(typeof response.body.review.designer).toBe("string");

    expect(response.body.review.hasOwnProperty("review_img_url")).toBe(true);
    expect(typeof response.body.review.review_img_url).toBe("string");

    expect(response.body.review.hasOwnProperty("category")).toBe(true);
    expect(typeof response.body.review.category).toBe("string");

    expect(response.body.review.hasOwnProperty("created_at")).toBe(true);

    expect(response.body.review.hasOwnProperty("votes")).toBe(true);
    expect(typeof response.body.review.votes).toBe("number");

    expect(response.body.review.hasOwnProperty("comment_count")).toBe(true);
    expect(typeof response.body.review.comment_count).toBe("number");
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

  test("404 : Returns Error Message when path references Invalid Id", async () => {
    const response = await request(app).get("/api/reviews/2000").expect(404);
    console.log(response.body);
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

    expect(response.body.updatedReview.hasOwnProperty("owner")).toBe(true);
    expect(typeof response.body.updatedReview.owner).toBe("string");

    expect(response.body.updatedReview.hasOwnProperty("title")).toBe(true);
    expect(typeof response.body.updatedReview.title).toBe("string");

    expect(response.body.updatedReview.hasOwnProperty("review_id")).toBe(true);
    expect(typeof response.body.updatedReview.review_id).toBe("number");

    expect(response.body.updatedReview.hasOwnProperty("review_body")).toBe(
      true
    );
    expect(typeof response.body.updatedReview.review_body).toBe("string");

    expect(response.body.updatedReview.hasOwnProperty("designer")).toBe(true);
    expect(typeof response.body.updatedReview.designer).toBe("string");

    expect(response.body.updatedReview.hasOwnProperty("review_img_url")).toBe(
      true
    );
    expect(typeof response.body.updatedReview.review_img_url).toBe("string");

    expect(response.body.updatedReview.hasOwnProperty("category")).toBe(true);
    expect(typeof response.body.updatedReview.category).toBe("string");

    expect(response.body.updatedReview.hasOwnProperty("created_at")).toBe(true);
    expect(typeof response.body.updatedReview.category).toBe("string");

    expect(response.body.updatedReview.hasOwnProperty("votes")).toBe(true);
    expect(typeof response.body.updatedReview.votes).toBe("number");
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

  test("404 : Returns Error Message when path references Invalid Id", async () => {
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
    expect(response.body.review_comments[0].hasOwnProperty("body")).toBe(true);
    expect(typeof response.body.review_comments[0].body).toBe("string");

    expect(response.body.review_comments[0].hasOwnProperty("votes")).toBe(true);
    expect(typeof response.body.review_comments[0].votes).toBe("number");

    expect(response.body.review_comments[0].hasOwnProperty("author")).toBe(
      true
    );
    expect(typeof response.body.review_comments[0].author).toBe("string");

    expect(response.body.review_comments[0].hasOwnProperty("review_id")).toBe(
      true
    );
    expect(typeof response.body.review_comments[0].review_id).toBe("number");

    expect(response.body.review_comments[0].hasOwnProperty("created_at")).toBe(
      true
    );
    expect(typeof response.body.review_comments[0].created_at).toBe("string");
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
    expect(typeof response.body.posted_comment).toEqual("object");
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
    expect(response.body.posted_comment.hasOwnProperty("comment_id")).toEqual(
      true
    );
    expect(typeof response.body.posted_comment.comment_id).toEqual("number");

    expect(response.body.posted_comment.hasOwnProperty("body")).toEqual(true);
    expect(typeof response.body.posted_comment.body).toEqual("string");

    expect(response.body.posted_comment.hasOwnProperty("votes")).toEqual(true);
    expect(typeof response.body.posted_comment.votes).toEqual("number");

    expect(response.body.posted_comment.hasOwnProperty("author")).toEqual(true);
    expect(typeof response.body.posted_comment.author).toEqual("string");

    expect(response.body.posted_comment.hasOwnProperty("review_id")).toEqual(
      true
    );
    expect(typeof response.body.posted_comment.review_id).toEqual("number");

    expect(response.body.posted_comment.hasOwnProperty("created_at")).toEqual(
      true
    );
    expect(typeof response.body.posted_comment.author).toEqual("string");
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
    expect(response.body.msg).toEqual("Invalid Review_ID or Username");
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
    expect(response.body.msg).toEqual("Invalid Review_ID or Username");
  });
});

describe("Get /api", () => {
  test("200 : Responds wtih object", async () => {
    const response = await request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(typeof response.body).toEqual("object");
  });

  test("200 : Responds wtih object with keys categories of paths : values list of available paths", async () => {
    const response = await request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
    expect(response.body.Misc_Endpoints).toEqual(["/", "/hello"]);
    expect(response.body.Category_Endpoints).toEqual("/");
    expect(response.body.Review_Endpoints).toEqual([
      "/",
      "/:review_id",
      "/:review_id/comments",
    ]);
  });
});
