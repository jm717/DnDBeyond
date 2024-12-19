# DDB Back End Developer Challenge

### Overview
This project provides an API to manage and interact with character hit points and related attributes. It includes endpoints for retrieving character information, dealing damage, and more. The API is designed for ease of use and extensibility.


### Accessing the API
API endpoints can be tested via Swagger UI. 

The API can be accessed at:
http://localhost:3000/api


#### Project setup

To run the project:

- Clone the repository from GitHub.

- Install dependencies using npm install.

- Start the server with npm run start.

- Access the application at http://localhost:3000/.

#### API Operations
1. **Deal Damage**
    - POST
    - http://localhost:3000/hp/briv/deal-damage
    - Example Request body
        {
            "damageType": "fire",
            "damageAmount": 14
        }

    - -curl -X 'POST' \
        'http://localhost:3000/hp/briv/deal-damage' \
        -H 'accept: */*' \
        -H 'Content-Type: application/json' \
        -d '{
        "damageType": "fire",
        "damageAmount": 14
        }'

2. **Heal**
    - POST
    - http://localhost:3000/hp/briv/heal
    - Example Request body
        {
            "healAmount": 5
        }

3. **Add Temporary Hit Points**
    - POST
    - http://localhost:3000/hp/briv/add/temp-hit-points
    -  Example Request body
        {
            "points": 5
        }

4. **Get Character Data**
    - GET
    - http://localhost:3000/hp/briv
    -  curl -X 'GET' \
        'http://localhost:3000/hp/briv' \
        -H 'accept: */*'

#### Running Tests
- Run tests with npm test

#### Data Management
- Character data is stored in the /data folder. To add more characters, simply create additional .json files in this folder. The application will load them automatically upon initialization
