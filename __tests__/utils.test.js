const {
  formatCategoryData,
  formatUserData,
  formatCommentData,
  formatReviewData,
} = require("../db/utils/data-manipulation");

describe("formatCategoryData", () => {
  test("should return return an array when passed another array", () => {
    let actualOutput = formatCategoryData([
      { slug: "slug1", description: "description1" },
      { slug: "slug2", description: "description2" },
    ]);

    expect(typeof actualOutput).toBe("object");
    expect(Array.isArray(actualOutput)).toBe(true);
  });

  test("should return return an array containing only arrays containing strings", () => {
    let actualOutput = formatCategoryData([
      { slug: "slug1", description: "description1" },
      { slug: "slug2", description: "description2" },
      { slug: "slug3", description: "description3" },
    ]);

    expect(typeof actualOutput[0]).toBe("object");
    expect(Array.isArray(actualOutput[0])).toBe(true);

    expect(typeof actualOutput[0][0]).toBe("string");
    expect(typeof actualOutput[0][1]).toBe("string");
    expect(typeof actualOutput[1][0]).toBe("string");
    expect(typeof actualOutput[1][1]).toBe("string");
    expect(typeof actualOutput[2][0]).toBe("string");
    expect(typeof actualOutput[2][1]).toBe("string");
  });

  test("should return return an array of same length as input array", () => {
    let expectedOutput = [
      ["slug1", "description1"],
      ["slug2", "description2"],
      ["slug3", "description3"],
    ];

    let actualOutput = formatCategoryData([
      { slug: "slug1", description: "description1" },
      { slug: "slug2", description: "description2" },
      { slug: "slug3", description: "description3" },
    ]);

    expect(actualOutput).toEqual(expectedOutput);
    expect(actualOutput.length).toEqual(expectedOutput.length);
  });

  test("should return return an array containing an array of the values in input objects", () => {
    let expectedOutput = [
      ["slug1", "description1"],
      ["slug2", "description2"],
      ["slug3", "description3"],
    ];

    let actualOutput = formatCategoryData([
      { slug: "slug1", description: "description1" },
      { slug: "slug2", description: "description2" },
      { slug: "slug3", description: "description3" },
    ]);

    expect(actualOutput).toEqual(expectedOutput);

    expectedOutput = [
      ["slugFirst", "descriptionFirst"],
      ["slugSecond", "descriptionSecond"],
      ["slugThird", "descriptionThird"],
    ];

    actualOutput = formatCategoryData([
      { slug: "slugFirst", description: "descriptionFirst" },
      { slug: "slugSecond", description: "descriptionSecond" },
      { slug: "slugThird", description: "descriptionThird" },
    ]);

    expect(actualOutput).toEqual(expectedOutput);
  });

  test("should not mutate original array", () => {
    let input = [
      { slug: "slug1", description: "description1" },
      { slug: "slug2", description: "description2" },
      { slug: "slug3", description: "description3" },
    ];

    let actualOutput = formatCategoryData(input);

    expect(input).toEqual([
      { slug: "slug1", description: "description1" },
      { slug: "slug2", description: "description2" },
      { slug: "slug3", description: "description3" },
    ]);
  });
});

describe("formatUserData", () => {
  test("should return return an array when passed another array", () => {
    let actualOutput = formatUserData([
      { username: "Adam1", avatar_url: "http1", name: "Adam" },
      { username: "Ben2", avatar_url: "http2", name: "Ben" },
      { username: "Carry3", avatar_url: "http3", name: "Carry" },
    ]);

    expect(typeof actualOutput).toBe("object");
    expect(Array.isArray(actualOutput)).toBe(true);
  });

  test("should return return an array of same length as input array", () => {
    let actualOutput = formatUserData([
      { username: "Adam1", avatar_url: "http1", name: "Adam" },
      { username: "Ben2", avatar_url: "http2", name: "Ben" },
      { username: "Carry3", avatar_url: "http3", name: "Carry" },
    ]);

    expect(typeof actualOutput).toBe("object");
    expect(Array.isArray(actualOutput)).toBe(true);
    expect(actualOutput.length).toBe(3);

    let expectedOutput = [
      ["Adam1", "http1", "Adam"],
      ["Ben2", "http2", "Ben"],
      ["Carry3", "http3", "Carry"],
    ];

    actualOutput = formatUserData([
      { username: "Adam1", avatar_url: "http1", name: "Adam" },
      { username: "Ben2", avatar_url: "http2", name: "Ben" },
      { username: "Carry3", avatar_url: "http3", name: "Carry" },
    ]);

    expect(actualOutput.length).toEqual(expectedOutput.length);
  });

  test("should return return an array containing only arrays containing strings", () => {
    let actualOutput = formatUserData([
      { username: "Adam1", avatar_url: "http1", name: "Adam" },
      { username: "Ben2", avatar_url: "http2", name: "Ben" },
      { username: "Carry3", avatar_url: "http3", name: "Carry" },
    ]);

    expect(typeof actualOutput[0]).toBe("object");
    expect(Array.isArray(actualOutput[0])).toBe(true);

    expect(typeof actualOutput[0][0]).toBe("string");
    expect(typeof actualOutput[0][1]).toBe("string");
    expect(typeof actualOutput[1][0]).toBe("string");
    expect(typeof actualOutput[1][1]).toBe("string");
    expect(typeof actualOutput[2][0]).toBe("string");
    expect(typeof actualOutput[2][1]).toBe("string");
  });

  test("should return return an array containing an array of the values in input objects", () => {
    let expectedOutput = [
      ["Adam1", "http1", "Adam"],
      ["Ben2", "http2", "Ben"],
      ["Carry3", "http3", "Carry"],
    ];

    let actualOutput = formatUserData([
      { username: "Adam1", avatar_url: "http1", name: "Adam" },
      { username: "Ben2", avatar_url: "http2", name: "Ben" },
      { username: "Carry3", avatar_url: "http3", name: "Carry" },
    ]);

    expect(actualOutput).toEqual(expectedOutput);

    expectedOutput = [
      ["A-Dawg", "http1", "Alex"],
      ["B-Dawg", "http2", "Beth"],
      ["C-Dawg", "http3", "Cathy"],
    ];

    actualOutput = formatUserData([
      { username: "A-Dawg", avatar_url: "http1", name: "Alex" },
      { username: "B-Dawg", avatar_url: "http2", name: "Beth" },
      { username: "C-Dawg", avatar_url: "http3", name: "Cathy" },
    ]);

    expect(actualOutput).toEqual(expectedOutput);
  });

  test("should not mutate original array", () => {
    let input = [
      { username: "Adam1", avatar_url: "http1", name: "Adam" },
      { username: "Ben2", avatar_url: "http2", name: "Ben" },
      { username: "Carry3", avatar_url: "http3", name: "Carry" },
    ];

    let actualOutput = formatUserData(input);

    expect(input).toEqual([
      { username: "Adam1", avatar_url: "http1", name: "Adam" },
      { username: "Ben2", avatar_url: "http2", name: "Ben" },
      { username: "Carry3", avatar_url: "http3", name: "Carry" },
    ]);
  });
});

describe("formatReviewData", () => {
  test("should return return an array when passed another array", () => {
    let actualOutput = formatReviewData([
      {
        title: "title1",
        review_body: "lipsum1",
        designer: "Andrew Designer 1",
        review_img_url: "https_1",
        votes: 1,
        category: "category 1",
        owner: "user1",
        created_at: new Date(1611316224771),
      },
      {
        title: "title2",
        review_body: "lipsum2",
        designer: "Betty Designer 2",
        review_img_url: "https_2",
        votes: 2,
        category: "category 2",
        owner: "user2",
        created_at: new Date(1611316224771),
      },
      {
        title: "title3",
        review_body: "lipsum3",
        designer: "Cathy Designer 3",
        review_img_url: "https_3",
        votes: 3,
        category: "category 3",
        owner: "user3",
        created_at: new Date(1611316224771),
      },
    ]);

    expect(typeof actualOutput).toBe("object");
    expect(Array.isArray(actualOutput)).toBe(true);
  });

  test("should return return an array of same length as input array", () => {
    let actualOutput = formatReviewData([
      {
        title: "title1",
        review_body: "lipsum1",
        designer: "Andrew Designer 1",
        review_img_url: "https_1",
        votes: 1,
        category: "category 1",
        owner: "user1",
        created_at: new Date(1611316224771),
      },
      {
        title: "title2",
        review_body: "lipsum2",
        designer: "Betty Designer 2",
        review_img_url: "https_2",
        votes: 2,
        category: "category 2",
        owner: "user2",
        created_at: new Date(1611316224771),
      },
    ]);

    expect(typeof actualOutput).toBe("object");
    expect(Array.isArray(actualOutput)).toBe(true);
    expect(actualOutput.length).toBe(2);

    let expectedOutput = [
      [
        "title1",
        "lipsum1",
        "Andrew Designer 1",
        "https_1",
        1,
        "category 1",
        "user1",
        new Date(1611316224771),
      ],
      [
        "title2",
        "lipsum2",
        "Betty Designer 2",
        "https_2",
        2,
        "category 2",
        "user2",
        new Date(1611316224771),
      ],
      [
        "title3",
        "lipsum3",
        "Cathy Designer 1",
        "https_3",
        3,
        "category 3",
        "user3",
        new Date(1611316224771),
      ],
    ];

    actualOutput = formatReviewData([
      {
        title: "title1",
        review_body: "lipsum1",
        designer: "Andrew Designer 1",
        review_img_url: "https_1",
        votes: 1,
        category: "category 1",
        owner: "user1",
        created_at: new Date(1611316224771),
      },
      {
        title: "title2",
        review_body: "lipsum2",
        designer: "Betty Designer 2",
        review_img_url: "https_2",
        votes: 2,
        category: "category 2",
        owner: "user2",
        created_at: new Date(1611316224771),
      },
      {
        title: "title3",
        review_body: "lipsum3",
        designer: "Cathy Designer 3",
        review_img_url: "https_3",
        votes: 3,
        category: "category 3",
        owner: "user3",
        created_at: new Date(1611316224771),
      },
    ]);

    expect(typeof actualOutput).toBe("object");
    expect(Array.isArray(actualOutput)).toBe(true);
    expect(actualOutput.length).toEqual(expectedOutput.length);
  });

  test("should return return an array containing an array of the values in input objects", () => {
    let expectedOutput = [
      [
        "title4",
        "lipsum4",
        "David Designer 4",
        "https_4",
        4,
        "category 4",
        "user4",
        new Date(1611316224771),
      ],
      [
        "title5",
        "lipsum5",
        "Ellie Designer 5",
        "https_5",
        5,
        "category 5",
        "user5",
        new Date(1611316224771),
      ],
    ];

    let actualOutput = formatReviewData([
      {
        title: "title4",
        review_body: "lipsum4",
        designer: "David Designer 4",
        review_img_url: "https_4",
        votes: 4,
        category: "category 4",
        owner: "user4",
        created_at: new Date(1611316224771),
      },
      {
        title: "title5",
        review_body: "lipsum5",
        designer: "Ellie Designer 5",
        review_img_url: "https_5",
        votes: 5,
        category: "category 5",
        owner: "user5",
        created_at: new Date(1611316224771),
      },
    ]);

    expect(actualOutput).toEqual(expectedOutput);

    expectedOutput = [
      [
        "title1",
        "lipsum1",
        "Andrew Designer 1",
        "https_1",
        1,
        "category 1",
        "user1",
        new Date(1611316224771),
      ],
      [
        "title2",
        "lipsum2",
        "Betty Designer 2",
        "https_2",
        2,
        "category 2",
        "user2",
        new Date(1611316224771),
      ],
      [
        "title3",
        "lipsum3",
        "Cathy Designer 1",
        "https_3",
        3,
        "category 3",
        "user3",
        new Date(1611316224771),
      ],
    ];

    actualOutput = formatReviewData([
      {
        title: "title1",
        review_body: "lipsum1",
        designer: "Andrew Designer 1",
        review_img_url: "https_1",
        votes: 1,
        category: "category 1",
        owner: "user1",
        created_at: new Date(1611316224771),
      },
      {
        title: "title2",
        review_body: "lipsum2",
        designer: "Betty Designer 2",
        review_img_url: "https_2",
        votes: 2,
        category: "category 2",
        owner: "user2",
        created_at: new Date(1611316224771),
      },
      {
        title: "title3",
        review_body: "lipsum3",
        designer: "Cathy Designer 3",
        review_img_url: "https_3",
        votes: 3,
        category: "category 3",
        owner: "user3",
        created_at: new Date(1611316224771),
      },
    ]);
  });

  test("should not mutate original array", () => {
    let input = [
      {
        title: "title4",
        review_body: "lipsum4",
        designer: "David Designer 4",
        review_img_url: "https_4",
        votes: 4,
        category: "category 4",
        owner: "user4",
        created_at: new Date(1611316224771),
      },
      {
        title: "title5",
        review_body: "lipsum5",
        designer: "Ellie Designer 5",
        review_img_url: "https_5",
        votes: 5,
        category: "category 5",
        owner: "user5",
        created_at: new Date(1611316224771),
      },
    ];

    formatReviewData(input);

    expect(input).toEqual([
      {
        title: "title4",
        review_body: "lipsum4",
        designer: "David Designer 4",
        review_img_url: "https_4",
        votes: 4,
        category: "category 4",
        owner: "user4",
        created_at: new Date(1611316224771),
      },
      {
        title: "title5",
        review_body: "lipsum5",
        designer: "Ellie Designer 5",
        review_img_url: "https_5",
        votes: 5,
        category: "category 5",
        owner: "user5",
        created_at: new Date(1611316224771),
      },
    ]);
  });
});

describe("formatCommentData", () => {
  test("should return return an array when passed another array", () => {
    let actualOutput = formatCommentData([
      {
        author: "Adam Author1",
        review_id: 1,
        votes: 1,
        created_at: new Date(1611316224771),
        body: "ipsum lorem1",
      },
      {
        author: "Betty Author2",
        review_id: 2,
        votes: 2,
        created_at: new Date(1611316224771),
        body: "ipsum lorem2",
      },
      {
        author: "Cathrine Author3",
        review_id: 3,
        votes: 3,
        created_at: new Date(1611316224771),
        body: "ipsum lorem3",
      },
    ]);

    expect(typeof actualOutput).toBe("object");
    expect(Array.isArray(actualOutput)).toBe(true);
  });

  test("should return return an array of same length as input array", () => {
    let actualOutput = formatCommentData([
      {
        author: "Adam Author1",
        review_id: 1,
        votes: 1,
        created_at: new Date(1611316224771),
        body: "ipsum lorem1",
      },
      {
        author: "Betty Author2",
        review_id: 2,
        votes: 2,
        created_at: new Date(1611316224771),
        body: "ipsum lorem2",
      },
    ]);

    expect(typeof actualOutput).toBe("object");
    expect(Array.isArray(actualOutput)).toBe(true);
    expect(actualOutput.length).toBe(2);

    let expectedOutput = [
      ["Adam Author1", 1, 1, new Date(1611316224771), "ipsum lorem1"],
      ["Betty Author2", 2, 2, new Date(1611316224771), "ipsum lorem2"],
      ["Cathrine Author3", 3, 3, new Date(1611316224771), "ipsum lorem3"],
    ];

    actualOutput = formatCommentData([
      {
        author: "Adam Author1",
        review_id: 1,
        votes: 1,
        created_at: new Date(1611316224771),
        body: "ipsum lorem1",
      },
      {
        author: "Betty Author2",
        review_id: 2,
        votes: 2,
        created_at: new Date(1611316224771),
        body: "ipsum lorem2",
      },
      {
        author: "Cathrine Author3",
        review_id: 3,
        votes: 3,
        created_at: new Date(1611316224771),
        body: "ipsum lorem3",
      },
    ]);

    expect(typeof actualOutput).toBe("object");
    expect(Array.isArray(actualOutput)).toBe(true);
    expect(actualOutput.length).toEqual(expectedOutput.length);
  });

  test("should return return an array containing an array of the values in input objects", () => {
    let expectedOutput = [
      ["Delilah Author4", 4, 1, new Date(1611316224771), "ipsum lorem4"],
      ["Ellie Author5", 5, 2, new Date(1611316224771), "ipsum lorem5"],
    ];

    actualOutput = formatCommentData([
      {
        author: "Delilah Author4",
        review_id: 4,
        votes: 1,
        created_at: new Date(1611316224771),
        body: "ipsum lorem4",
      },
      {
        author: "Ellie Author5",
        review_id: 5,
        votes: 2,
        created_at: new Date(1611316224771),
        body: "ipsum lorem5",
      },
    ]);

    expect(actualOutput).toEqual(expectedOutput);

    expectedOutput = [
      ["Gemma Author7", 7, 1, new Date(1611316224771), "ipsum lorem7"],
      ["Helen Author8", 8, 2, new Date(1611316224771), "ipsum lorem8"],
      ["Issac Author9", 9, 3, new Date(1611316224771), "ipsum lorem9"],
    ];

    actualOutput = formatCommentData([
      {
        author: "Gemma Author7",
        review_id: 7,
        votes: 1,
        created_at: new Date(1611316224771),
        body: "ipsum lorem7",
      },
      {
        author: "Helen Author8",
        review_id: 8,
        votes: 2,
        created_at: new Date(1611316224771),
        body: "ipsum lorem8",
      },
      {
        author: "Issac Author9",
        review_id: 9,
        votes: 3,
        created_at: new Date(1611316224771),
        body: "ipsum lorem9",
      },
    ]);

    expect(actualOutput).toEqual(expectedOutput);
  });

  test("should not mutate original array", () => {
    let input = [
      {
        author: "Adam Author1",
        review_id: 1,
        votes: 1,
        created_at: new Date(1611316224771),
        body: "ipsum lorem1",
      },
      {
        author: "Betty Author2",
        review_id: 2,
        votes: 2,
        created_at: new Date(1611316224771),
        body: "ipsum lorem2",
      },
      {
        author: "Cathrine Author3",
        review_id: 3,
        votes: 3,
        created_at: new Date(1611316224771),
        body: "ipsum lorem3",
      },
    ];

    formatCommentData(input);

    expect(input).toEqual([
      {
        author: "Adam Author1",
        review_id: 1,
        votes: 1,
        created_at: new Date(1611316224771),
        body: "ipsum lorem1",
      },
      {
        author: "Betty Author2",
        review_id: 2,
        votes: 2,
        created_at: new Date(1611316224771),
        body: "ipsum lorem2",
      },
      {
        author: "Cathrine Author3",
        review_id: 3,
        votes: 3,
        created_at: new Date(1611316224771),
        body: "ipsum lorem3",
      },
    ]);
  });
});
