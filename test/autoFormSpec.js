describe('Given Augmented Automatic Form', () => {
	it('is defined', () => {
		expect(Form.AutomaticForm).to.not.be.undefined;
	});

	it('is not initialized without a schema', () => {
		let f = new Form.AutomaticForm();
		expect(f).to.not.be.undefined;
		expect(f.isInitalized).to.be.false;
	});

	describe('Given some user data and a schema', () => {
		let uri = "test.json";
		let schema = {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"title": "User",
			"description": "A list of users",
			"type": "object",
			"properties": {
				"Name" : {
					"description": "Name of the user",
					"type" : "string"
				},
				"ID" : {
					"description": "The unique identifier for a user",
					"type" : "integer"
				},
				"Email" : {
					"description": "The email of the user",
					"type" : "string"
				}
			},
			"required": ["ID", "Name"]
		};

		let data = { "Name": "Bob", "ID": 123, "Email": "bob@augmentedjs.org" };

		let f;

		beforeEach(() => {
			f = new Form.AutomaticForm({schema: schema});
		});

		afterEach(() => {
			f.remove();
			f = null;
		});

		it('can create an instance', () => {
			expect(f instanceof Form.AutomaticForm).to.be.true;
		});

		it('is initialized with a schema', () => {
			expect(f).to.not.be.undefined;
			expect(f.isInitalized).to.be.true;
		});

		it('can set uri and schema', () => {
			f.setURI(uri);
			expect(f.uri).to.equal(uri);
			expect(f.schema).to.equal(schema);
		});

		it('can populate data', () => {
			f.populate(data);
			expect(f.model.toJSON()).to.deep.equal(data);
		});

		it('can validate', () => {
			f.populate(data);
			const m = f.validate();
			expect(m).to.not.be.undefined;
			const x = f.isValid();
			expect(x).to.be.true;
		});

		it('can invalidate bad data', () => {
			f.populate({ "x": "x" });
			let m = f.validate();
			expect(m).to.not.be.undefined;
			expect(f.isValid()).to.be.false;
		});
	});
});
