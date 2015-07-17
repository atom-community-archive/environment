"use babel";

describe('Environment', () => {
  let environmentMain, environment = null;
  beforeEach(() => {
    this.environmentMain = null;
    this.environment = null;
    waitsForPromise(() => {
      return atom.packages.activatePackage('environment').then(pack => {
        this.environmentMain = pack.mainModule;
      });
    });
  });

  describe('when the environment package is activated', () => {
    it('activates successfully', () => {
      expect(this.environmentMain).toBeDefined();
    });

    fit('provides the environment service', () => {
      expect(this.environmentMain).toBeDefined();
      let called = false;
      expect(environment).toBeFalsy();
      atom.packages.serviceHub.consume('environment', '0.1.0', (e) => {
        environment = e
        called = true;
      });

      waitsFor(() => {
        return called;
      });

      runs(() => {
        expect(environment).toBeTruthy();
      });
    });
  });
});
