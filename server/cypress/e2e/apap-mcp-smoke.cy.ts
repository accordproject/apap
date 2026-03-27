describe('APAP + MCP smoke tests', () => {
  it('returns server capabilities', () => {
    cy.request('/capabilities').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include('TEMPLATE_MANAGE');
      expect(response.body).to.include('AGREEMENT_MANAGE');
      expect(response.body).to.include('SHARED_MODEL_MANAGE');
      expect(response.body).to.include('AGREEMENT_CONVERT_HTML');
      expect(response.body).to.include('AGREEMENT_TRIGGER');
    });
  });

  it('rejects invalid MCP request without a valid session', () => {
    cy.request({
      method: 'POST',
      url: '/mcp',
      failOnStatusCode: false,
      body: {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
      },
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('jsonrpc', '2.0');
      expect(response.body).to.have.property('error');
      expect(response.body.error.message).to.contain('No valid session ID provided');
    });
  });
});
