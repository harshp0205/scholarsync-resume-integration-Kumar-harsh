describe('ScholarSync E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage correctly', () => {
    cy.contains('ScholarSync').should('be.visible');
    cy.contains('Connect Your Resume with Academic Excellence').should('be.visible');
    cy.contains('Upload Resume').should('be.visible');
    cy.contains('Google Scholar Profile').should('be.visible');
  });

  it('should show error for invalid file upload', () => {
    cy.get('input[type="file"]').should('exist');
    
    // Create and upload an invalid file using selectFile (Cypress 12+)
    const fileName = 'test.txt';
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('This is a text file'),
      fileName: fileName,
      mimeType: 'text/plain'
    }, { force: true });

    cy.contains('Invalid file type').should('be.visible');
  });

  it('should handle Google Scholar URL validation', () => {
    cy.get('input[placeholder*="scholar.google.com"]').type('invalid-url');
    cy.contains('Fetch Profile').click();
    
    cy.contains('Please enter a valid Google Scholar profile URL').should('be.visible');
  });

  it('should show loading states', () => {
    // Test resume upload loading
    cy.get('input[type="file"]').should('exist');
    
    // Test Scholar profile loading
    cy.get('input[placeholder*="scholar.google.com"]')
      .type('https://scholar.google.com/citations?user=test123');
    cy.contains('Fetch Profile').click();
    cy.contains('Fetching...').should('be.visible');
  });

  it('should be responsive on mobile', () => {
    cy.viewport('iphone-6');
    
    cy.contains('ScholarSync').should('be.visible');
    cy.get('[class*="grid-cols-1"]').should('exist');
    
    // Check that mobile layout is applied
    cy.get('[class*="lg:grid-cols-2"]').should('have.class', 'grid-cols-1');
  });

  it('should navigate through the page sections', () => {
    // Check features section
    cy.contains('Powerful Features').should('be.visible');
    cy.contains('Smart Resume Parsing').should('be.visible');
    cy.contains('Scholar Integration').should('be.visible');
    cy.contains('AI-Powered Suggestions').should('be.visible');
    
    // Check footer
    cy.contains('© 2025 ScholarSync').should('be.visible');
  });

  it('should handle search functionality', () => {
    cy.get('input[placeholder*="Search for papers"]').type('machine learning');
    
    // Wait for search to potentially trigger
    cy.wait(1000);
    
    // The search might show results or handle rate limiting
    // This is more of a smoke test to ensure no crashes
  });

  it('should display project suggestions placeholder', () => {
    cy.contains('Project Suggestions').should('be.visible');
    cy.contains('Upload your resume to see personalized project suggestions').should('be.visible');
  });
});
