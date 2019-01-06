import { 
  Rule,
  SchematicContext, 
  Tree, 
  SchematicsException, 
  chain,
 // externalSchematic,
  filter,
  apply,
  move,
  template,
  url,
  branchAndMerge,
  mergeWith
 } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import { addDeclarationToNgModule } from '../utils/ng-utils';
//import { findModuleFromOptions , ModuleOptions} from '@schematics/angular/utility/find-module';
import { NavOptions } from './schema';
//import { getWorkspace } from '@schematics/angular/utility/config';

export function mimo(_options: NavOptions): Rule {
  return chain([
    //externalSchematic('@schematics/angular', 'component', _options),
    (tree: Tree, _context: SchematicContext) => {
      //console.log(_options);
      if(!_options.name){
        throw new SchematicsException('name option is required !');
      }
      if(!_options.module){
        throw new SchematicsException('module option is required !');
      }

      _options.path = `src/${_options.path}`;
     _options.module = `${_options.path}/${_options.module}`

      const templateSource = apply(url('./files'), [
        filter(path => !path.match(/\.bak$/)),
        template({
          ...strings,
          ..._options
        }),
        move(_options.path)
      ]);

      const rule = chain([
        branchAndMerge(chain([
          mergeWith(templateSource),
          addDeclarationToNgModule(_options,false)
        ]))
      ]);
    return rule(tree, _context);
    }
  ]);
}
