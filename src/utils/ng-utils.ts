
// Option A: Directly referencing the private APIs
 //import { buildRelativePath } from "@schematics/angular/utility/find-module";
 import { Rule, Tree, SchematicsException } from "@angular-devkit/schematics";
 import { strings, normalize } from "@angular-devkit/core";
 import { addDeclarationToModule, addExportToModule } from "@schematics/angular/utility/ast-utils";
 import { InsertChange } from "@schematics/angular/utility/change";
 import * as ts from 'typescript';
import { NavOptions } from "../nav/schema";

 export class AddToModuleContext {
    source: ts.SourceFile;
    relativePath: string;
    classifiedName: string;
}

export function addDeclarationToNgModule(options: NavOptions, exports: boolean): Rule {
  return (host: Tree) => {
    addDeclaration(host, options);
    if (exports) {
      addExport(host, options);
    }
    return host;
  };
}

function createAddToModuleContext(host: Tree, options: NavOptions): AddToModuleContext {

  const result = new AddToModuleContext();

  if (!options.module) {
    throw new SchematicsException(`Module not found.`);
  }
  options.module = normalize(options.module);
  const text = host.read(options.module);

  if (text === null) {
    throw new SchematicsException(`File ${options.module} does not exist!`);
  }
  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(options.module, sourceText, ts.ScriptTarget.Latest, true);

  const componentPath = `${options.path}/`
      + strings.dasherize(options.name) + '/'
      + strings.dasherize(options.name)
      + '.component';
  console.log(componentPath);
  //result.relativePath = buildRelativePath(options.module, componentPath);
  result.relativePath = `./`
      + strings.dasherize(options.name) + '/'
      + strings.dasherize(options.name)
      + '.component'

  result.classifiedName = strings.classify(`${options.name}Component`);

  return result;

}

function addDeclaration(host: Tree, options: NavOptions) {

  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const declarationChanges = addDeclarationToModule(context.source,
    modulePath,
      context.classifiedName,
      context.relativePath);

  const declarationRecorder = host.beginUpdate(modulePath);
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
};

function addExport(host: Tree, options: NavOptions) {
  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const exportChanges = addExportToModule(context.source,
      modulePath,
      context.classifiedName,
      context.relativePath);

  const exportRecorder = host.beginUpdate(modulePath);

  for (const change of exportChanges) {
    if (change instanceof InsertChange) {
      exportRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(exportRecorder);
};