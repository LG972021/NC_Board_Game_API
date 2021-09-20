const { formatCategoryData, formatUserData } = require("../db/utils/data-manipulation");

describe.only("formatCategoryData", ()=> {
    test("should return return an array when passed another array", ()=> {        
        let actualOutput = formatCategoryData([
                {slug:'slug1', description:'description1'}, 
                {slug:'slug2', description:'description2'}])

        expect(typeof actualOutput).toBe('object');
        expect(Array.isArray(actualOutput)).toBe(true);
    })

    test("should return return an array containing only arrays containing strings", ()=> {      
        let actualOutput = formatCategoryData([
                {slug:'slug1', description:'description1'}, 
                {slug:'slug2', description:'description2'}, 
                {slug:'slug3', description:'description3'}]);

                expect(typeof actualOutput[0]).toBe('object');
                expect(Array.isArray(actualOutput[0])).toBe(true);

                expect(typeof actualOutput[0][0]).toBe('string');
                expect(typeof actualOutput[0][1]).toBe('string');
                expect(typeof actualOutput[1][0]).toBe('string');
                expect(typeof actualOutput[1][1]).toBe('string');
                expect(typeof actualOutput[2][0]).toBe('string');
                expect(typeof actualOutput[2][1]).toBe('string');
            });

            test("should return return an array of same length as input array", ()=> {
                let expectedOutput = [
                    ['slug1', 'description1'],['slug2', 'description2'], ['slug3', 'description3']
                ];
                
                let actualOutput = formatCategoryData([
                        {slug:'slug1', description:'description1'}, 
                        {slug:'slug2', description:'description2'},
                        {slug:'slug3', description:'description3'}]);
        
                expect(actualOutput).toEqual(expectedOutput);
                expect(actualOutput.length).toEqual(expectedOutput.length);
            });

            test("should return return an array containing an array of the values in input objects", ()=> {
                let expectedOutput = [
                    ['slug1', 'description1'],['slug2', 'description2'], ['slug3', 'description3']
                ];
                
                let actualOutput = formatCategoryData([
                        {slug:'slug1', description:'description1'}, 
                        {slug:'slug2', description:'description2'},
                        {slug:'slug3', description:'description3'}])
        
                expect(actualOutput).toEqual(expectedOutput);
        
        
                expectedOutput = [
                    ['slugFirst', 'descriptionFirst'],['slugSecond', 'descriptionSecond'], ['slugThird', 'descriptionThird']
                ];
                
                actualOutput = formatCategoryData([
                        {slug:'slugFirst', description:'descriptionFirst'}, 
                        {slug:'slugSecond', description:'descriptionSecond'},
                        {slug:'slugThird', description:'descriptionThird'}]);
        
                expect(actualOutput).toEqual(expectedOutput);
            })
})

describe.only("formatUserData", ()=> {
    test("should return return an array when passed another array", ()=> {        
        let actualOutput = formatUserData([
                {username:'Adam1', avatar_url: 'http1', name: 'Adam' }, 
                {username:'Ben2', avatar_url: 'http2', name: 'Ben' },
                {username:'Carry3', avatar_url: 'http3', name: 'Carry' }
            ]);

        expect(typeof actualOutput).toBe('object');
        expect(Array.isArray(actualOutput)).toBe(true);

    });

    test("should return return an array of same length as input array", ()=> {        
        let actualOutput = formatUserData([
                {username:'Adam1', avatar_url: 'http1', name: 'Adam' }, 
                {username:'Ben2', avatar_url: 'http2', name: 'Ben' },
                {username:'Carry3', avatar_url: 'http3', name: 'Carry' }
            ]);

        expect(typeof actualOutput).toBe('object');
        expect(Array.isArray(actualOutput)).toBe(true);
        expect(actualOutput.length).toBe(3);


        let expectedOutput = [
            ['Adam1', 'http1', 'Adam'],['Ben2', 'http2', 'Ben'], ['Carry3', 'http3', 'Carry']
        ];
        
        actualOutput = formatUserData([
            {username:'Adam1', avatar_url: 'http1', name: 'Adam' }, 
            {username:'Ben2', avatar_url: 'http2', name: 'Ben' },
            {username:'Carry3', avatar_url: 'http3', name: 'Carry' }
            ])

        expect(actualOutput.length).toEqual(expectedOutput.length);

    })

    test("should return return an array containing only arrays containing strings", ()=> {      
        let actualOutput = formatUserData([
            {username:'Adam1', avatar_url: 'http1', name: 'Adam' }, 
            {username:'Ben2', avatar_url: 'http2', name: 'Ben' },
            {username:'Carry3', avatar_url: 'http3', name: 'Carry' }
            ]);

                expect(typeof actualOutput[0]).toBe('object');
                expect(Array.isArray(actualOutput[0])).toBe(true);

                expect(typeof actualOutput[0][0]).toBe('string');
                expect(typeof actualOutput[0][1]).toBe('string');
                expect(typeof actualOutput[1][0]).toBe('string');
                expect(typeof actualOutput[1][1]).toBe('string');
                expect(typeof actualOutput[2][0]).toBe('string');
                expect(typeof actualOutput[2][1]).toBe('string');
            });

    test("should return return an array containing an array of the values in input objects", ()=> {
        let expectedOutput = [
            ['Adam1', 'http1', 'Adam'],['Ben2', 'http2', 'Ben'], ['Carry3', 'http3', 'Carry']
        ];
        
        let actualOutput = formatUserData([
            {username:'Adam1', avatar_url: 'http1', name: 'Adam' }, 
            {username:'Ben2', avatar_url: 'http2', name: 'Ben' },
            {username:'Carry3', avatar_url: 'http3', name: 'Carry' }
            ])

        expect(actualOutput).toEqual(expectedOutput);


        expectedOutput = [
            ['A-Dawg', 'http1', 'Alex'],['B-Dawg', 'http2', 'Beth'], ['C-Dawg', 'http3', 'Cathy']
        ];
        
        actualOutput = formatUserData([
            {username:'A-Dawg', avatar_url: 'http1', name: 'Alex' }, 
            {username:'B-Dawg', avatar_url: 'http2', name: 'Beth' },
            {username:'C-Dawg', avatar_url: 'http3', name: 'Cathy' }
            ]);

        expect(actualOutput).toEqual(expectedOutput);
    });

})
