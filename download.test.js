const devNull = require('dev-null')
const {downloadBlob, blobExists } = require('./download')

const validContainer = 'archives-prepress-1994'
const validBlob = '419413-1.7z'

const invalidContainer = 'foobar-1234'
const invalidBlob = 'blah.7z'

describe('Test existing file', () => {
    test('inexistant blob returns false', async () => {
        await expect(blobExists(invalidContainer, invalidBlob)).rejects.toBeFalsy()
    })
    test('existing container and blob returns true', async () => {
        await expect(blobExists(validContainer, validBlob)).resolves.toBeTruthy()
    })
})

describe('Error handling', () => {
    test('inexistant blob throws error', async () => {
        await expect(downloadBlob(validContainer, invalidBlob)).rejects.toThrow('No blob exists with this name')
    })
    test('inexistant container throws error', async () => {
        await expect(downloadBlob(invalidContainer, validBlob)).rejects.toThrow('No container exists with this name')
    })
    test('inexistant container and inexistant blob throw error', async () => {
        await expect(downloadBlob(invalidContainer, invalidBlob)).rejects.toThrow('No container exists with this name')
    })
})

describe('What success looks like', () => {
    test('container and blob exist', async () => {
        // pipe file output to /dev/null using the dev-null module
        const res = await downloadBlob(validContainer, validBlob, devNull())
        expect(res).toBeTruthy()
    })
})
