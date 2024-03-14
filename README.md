# CSV Automation and Database Integration

This Node.js project automates the process of reading CSV files from a designated folder, dynamically generating schemas based on the header, and pushing the data into a MongoDB database. After processing each file, it moves them to an "uploadDone" folder for tracking. This README file provides an overview of the project, installation instructions, and usage guidelines.

## Features

- Automatically reads CSV files from a specified folder.
- Dynamically generates schemas based on the headers of the CSV files.
- Infers data types for each column in the CSV files.
- Pushes the data into MongoDB collections.
- Moves processed files to an "uploadDone" folder.

## Prerequisites

- Node.js installed on your machine.
- MongoDB installed and running.

## Installation

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/jaybhanu12/FileToDBAutomator
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and provide necessary configurations:

    ```plaintext
    MONGODB_URI=your_mongodb_connection_uri
    ```

## Usage

1. Place your CSV files in the `src/myfolder` directory.
2. Start the server:

    ```bash
    npm start
    ```

3. The application will automatically read each CSV file in the folder, generate schemas, push data to the database, and move the processed files to the `src/UploadDone` folder.

## Configuration

- You can modify the data delimiter detection logic in the `detectDelimiter` function inside `ReadCSVHeader` function to support different delimiters.
- Ensure your CSV files have headers on the first line and appropriate data types on the second line for accurate schema generation.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Acknowledgements

- This project was inspired by the need for automated CSV processing in database applications.
- Special thanks to the Node.js and MongoDB communities for their valuable contributions and resources.

## Contact

For any inquiries or support, please contact [jaybhanushali303@gmail.com](mailto:jaybhanushali303@gmail.com).

## Authors

- [@jaybhanu12](https://www.github.com/jaybhanu12)
