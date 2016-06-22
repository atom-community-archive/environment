'use babel'

describe('Environment', () => {
  let environmentMain = null
  let service = null
  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage('environment').then((pack) => {
        environmentMain = pack.mainModule
      })
    })
  })

  describe('when the environment package is activated', () => {
    it('activates successfully', () => {
      expect(environmentMain).toBeDefined()
    })

    it('provides the environment service', () => {
      expect(environmentMain).toBeDefined()
      let called = false
      expect(service).toBeFalsy()
      atom.packages.serviceHub.consume('environment', '1.0.0', (e) => {
        service = e
        called = true
      })

      waitsFor(() => {
        return called
      })

      runs(() => {
        expect(service).toBeTruthy()
      })
    })
  })
})
