describe('GraphQL Live Server:', () => {
	let createdUserID;
	let createdDestinationID;

	it('creates a user', () => {
		const addUserQuery = `mutation {
			addUser(name: "Josh", email: "test@gmail.com", password: "test") {
				  id
				  name
				  email
				  password
			}
		}`;

		cy.request({
			url: 'http://localhost:5000/graphql',
			method: 'POST',
			body: { query: addUserQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
			const userData = res.body.data.addUser;
			createdUserID = userData.id;
			cy.wrap(userData)
				.should('have.property', 'name')
				.and('eq', 'Josh');
			cy.wrap(userData)
				.should('have.property', 'email')
				.and('eq', 'test@gmail.com');
			cy.wrap(userData)
				.should('have.property', 'password')
				.and('eq', 'test');
		});
	});

	it('adds a destination', () => {
		const addDestinationQuery = `mutation {
			addDestination(title: "Test Destination", description: "It is a test. It is awesome if it works", user: "${createdUserID}") {
				id
				title
				user {
					id
					name
					email
				}
				description
			}
		}`;

		cy.request({
			url: 'http://localhost:5000/graphql',
			method: 'POST',
			body: { query: addDestinationQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
			const destinationData = res.body.data.addDestination;
			createdDestinationID = destinationData.id;
			cy.wrap(destinationData)
				.should('have.property', 'title')
				.and('eq', 'Test Destination');
			cy.wrap(destinationData)
				.should('have.property', 'description')
				.and('eq', 'It is a test. It is awesome if it works');
			cy.wrap(destinationData).should('have.property', 'user');
		});
	});

	it('deletes a destination', () => {
		const deleteDestinationQuery = `mutation {
			addDestination(id: "${createdDestinationID}) {
				id
			}
		}`;

		cy.request({
			url: 'http://localhost:5000/graphql',
			method: 'POST',
			body: { query: deleteDestinationQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
		});
	});

	it('deletes a user', () => {
		const deleteUserQuery = `mutation {
			deleteUser(id: "${createdUserID}") {
				id
			}
		}`;

		cy.request({
			url: 'http://localhost:5000/graphql',
			method: 'POST',
			body: { query: deleteUserQuery },
			failOnStatusCode: false, // not a must but in case the fail code is not 200 / 400
		}).then(res => {
			cy.log(res);
		});
	});
});
