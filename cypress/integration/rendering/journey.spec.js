import { imgSnapshotTest, renderGraph } from '../../helpers/util.ts';

describe('User journey diagram', () => {
  it('Simple test', () => {
    imgSnapshotTest(
      `journey
title Adding journey diagram functionality to mermaid
section Order from website
    `,
      {}
    );
  });

  it('should render a user journey chart', () => {
    imgSnapshotTest(
      `
    journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 3: Me
      `,
      {}
    );
  });

  it('should render a user journey diagram when useMaxWidth is true (default)', () => {
    renderGraph(
      `journey
title E-Commerce
section Order from website
  Add to cart: 5: Me
section Checkout from website
  Add payment details: 5: Me
    `,
      { journey: { useMaxWidth: true } }
    );
    cy.get('svg').should((svg) => {
      expect(svg).to.have.attr('width', '100%');
      expect(svg).to.have.attr('height');
      // const height = parseFloat(svg.attr('height'));
      // expect(height).to.eq(565);
      const style = svg.attr('style');
      expect(style).to.match(/^max-width: [\d.]+px;$/);
      const maxWidthValue = parseFloat(style.match(/[\d.]+/g).join(''));
      expect(maxWidthValue).to.eq(700);
    });
  });

  it('should render a user journey diagram when useMaxWidth is false', () => {
    imgSnapshotTest(
      `journey
title E-Commerce
section Order from website
  Add to cart: 5: Me
section Checkout from website
  Add payment details: 5: Me
    `,
      { journey: { useMaxWidth: false } }
    );
  });

  it('should maintain sufficient space between legend labels and diagram elements', () => {
    renderGraph(
      `journey
    title  Web hook life cycle
    section Darkoob 
        Make preBuilt:5: Darkoob user 
        register slug : 5: Darkoob userf
      Map slug to a Prebuilt Job:5: Darkoob user
    section External Service
      set Darkoob slug as hook for an Event : 5 : admin Exjjjnjjjj qwerty
      listen to the events : 5 :  External Service 
      call darkoob endpoint : 5 : External Service 
    section Darkoob  
        check for inputs : 5 : DarkoobAPI
        run the prebuilt job : 5 : DarkoobAPI 
    `,
      { journey: { useMaxWidth: true } }
    );

    let LabelEndX, diagramStartX;

    // Get right edge of the legend
    cy.contains('tspan', 'admin Exjjjnjjjj qwerty').then((textBox) => {
      const bbox = textBox[0].getBBox();
      LabelEndX = bbox.x + bbox.width;
    });

    // Get left edge of the diagram
    cy.contains('foreignobject', 'Make preBuilt').then((rect) => {
      diagramStartX = parseFloat(rect.attr('x'));
    });

    // Assert right edge of the diagram is greater than or equal to the right edge of the label
    cy.then(() => {
      expect(diagramStartX).to.be.gte(LabelEndX);
    });
  });

  it('should maintain sufficient space between legend and diagram when legend labels are longer', () => {
    renderGraph(
      `journey
      title  Web hook life cycle
      section Darkoob
        Make preBuilt:5: Darkoob user
        register slug : 5: Darkoob userf deliberately increasing the size of this label to check if distance between legend and diagram is  maintained
        Map slug to a Prebuilt Job:5: Darkoob user
      section External Service
        set Darkoob slug as hook for an Event : 5 : admin Exjjjnjjjj qwerty
        listen to the events : 5 :  External Service
        call darkoob endpoint : 5 : External Service
      section Darkoob
        check for inputs : 5 : DarkoobAPI
        run the prebuilt job : 5 : DarkoobAPI
        `,
      { journey: { useMaxWidth: true } }
    );

    let LabelEndX, diagramStartX;

    // Get right edge of the legend
    cy.contains('tspan', 'Darkoob userf deliberately increasing the size of this label').then(
      (textBox) => {
        const bbox = textBox[0].getBBox();
        LabelEndX = bbox.x + bbox.width;
      }
    );

    // Get left edge of the diagram
    cy.contains('foreignobject', 'Make preBuilt').then((rect) => {
      diagramStartX = parseFloat(rect.attr('x'));
    });

    // Assert right edge of the diagram is greater than or equal to the right edge of the label
    cy.then(() => {
      expect(diagramStartX).to.be.gte(LabelEndX);
    });
  });
});
