interface XPSPackageOptions {
    projectLocation: string;
    packageLocation: string;
    name: string;
    xpsDBRef: any;
  }

export default class XPSPackage {
    projectLocation = ''

    packageLocation = ''

    name = ''

    xpsDBRef: any;

    constructor(opts: XPSPackageOptions) {
      this.name = opts.name
      this.projectLocation = opts.projectLocation
      this.packageLocation = opts.packageLocation
      this.xpsDBRef = opts.xpsDBRef
    }
}
