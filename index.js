const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git/promise')();
const { randomInt } = require('crypto');
const File_Path = 'data.json';

const makeCommit = async (n) => {
    if (n === 0) {
        try {
            await simpleGit.push();
            console.log('Push result: Success');
        } catch (err) {
            console.error('Error pushing changes:', err);
        }
        return;
    }

    const x = randomInt(0, 55);
    const y = randomInt(0, 7);

    const DATE = moment().subtract(1, 'years').add(x, 'weeks').add(y, 'days').format('YYYY-MM-DDTHH:mm:ss');

    // Ensure unique content for each commit
    const data = {
        date: DATE,
        randomValue: randomInt(0, 1000000), // Add a random value to ensure the content is unique
        message: `Commit number ${n}` // Add a unique message
    };

    console.log(`Committing date: ${DATE}, random value: ${data.randomValue}, message: ${data.message}`);

    try {
        await jsonfile.writeFile(File_Path, data);
        console.log('JSON file written successfully.');

        await simpleGit.add([File_Path]);
        console.log('File added to git.');

        await simpleGit.commit(data.message, { '--date': DATE });
        console.log('Commit result: Success');

        // Recursive call
        await makeCommit(n - 1);
    } catch (err) {
        console.error('Error in git operations:', err);
    }
};

// Start the commit process
makeCommit(500);
