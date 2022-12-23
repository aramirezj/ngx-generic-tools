'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ngx-workspace documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/GTFormModule.html" data-type="entity-link" >GTFormModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' : 'data-target="#xs-components-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' :
                                            'id="xs-components-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' }>
                                            <li class="link">
                                                <a href="components/GTBotoneraComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTBotoneraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GTChipsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTChipsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GTGenericEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTGenericEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GTMatErrorMessagesDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTMatErrorMessagesDirective</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GTSelectMaestroComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTSelectMaestroComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' : 'data-target="#xs-directives-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' :
                                        'id="xs-directives-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' }>
                                        <li class="link">
                                            <a href="directives/GTConversionDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTConversionDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' : 'data-target="#xs-injectables-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' :
                                        'id="xs-injectables-links-module-GTFormModule-10b8d335aee5345cddfb74955acd4b3a6babdaadbf63480762cee7e999724d493232ce0ba7a2f349230cebdd21c00a64cc5b601976885e54cc00ae9f3050185e"' }>
                                        <li class="link">
                                            <a href="injectables/GTFormService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTFormService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GTSharedModule.html" data-type="entity-link" >GTSharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' : 'data-target="#xs-components-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' :
                                            'id="xs-components-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' }>
                                            <li class="link">
                                                <a href="components/GTConfirmacionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTConfirmacionComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' : 'data-target="#xs-injectables-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' :
                                        'id="xs-injectables-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' }>
                                        <li class="link">
                                            <a href="injectables/SharedService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SharedService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' : 'data-target="#xs-pipes-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' :
                                            'id="xs-pipes-links-module-GTSharedModule-859bfb492a1644b7a453f78639be99789165f5c76d59a9abb080795a08dea5fe34cc848716ab98cbc8bf2591ba2d1543fe41ba99e87973665df0062318235c3f"' }>
                                            <li class="link">
                                                <a href="pipes/TextoSlicePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TextoSlicePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GTTableModule.html" data-type="entity-link" >GTTableModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GTTableModule-1ebe86bc97aa2367165e0ca42a31d9ba65b460525e2c5920ddc83f3a72bb25f6e9ae3f6824d2992e1746b91a8397efe4462742c7c1ba51fa9fb137aaf1eac2e7"' : 'data-target="#xs-components-links-module-GTTableModule-1ebe86bc97aa2367165e0ca42a31d9ba65b460525e2c5920ddc83f3a72bb25f6e9ae3f6824d2992e1746b91a8397efe4462742c7c1ba51fa9fb137aaf1eac2e7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GTTableModule-1ebe86bc97aa2367165e0ca42a31d9ba65b460525e2c5920ddc83f3a72bb25f6e9ae3f6824d2992e1746b91a8397efe4462742c7c1ba51fa9fb137aaf1eac2e7"' :
                                            'id="xs-components-links-module-GTTableModule-1ebe86bc97aa2367165e0ca42a31d9ba65b460525e2c5920ddc83f3a72bb25f6e9ae3f6824d2992e1746b91a8397efe4462742c7c1ba51fa9fb137aaf1eac2e7"' }>
                                            <li class="link">
                                                <a href="components/GTBotoneraComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTBotoneraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GTChipsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTChipsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GTGenericEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTGenericEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GTMatErrorMessagesDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTMatErrorMessagesDirective</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GTSelectMaestroComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTSelectMaestroComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-GTTableModule-1ebe86bc97aa2367165e0ca42a31d9ba65b460525e2c5920ddc83f3a72bb25f6e9ae3f6824d2992e1746b91a8397efe4462742c7c1ba51fa9fb137aaf1eac2e7"' : 'data-target="#xs-directives-links-module-GTTableModule-1ebe86bc97aa2367165e0ca42a31d9ba65b460525e2c5920ddc83f3a72bb25f6e9ae3f6824d2992e1746b91a8397efe4462742c7c1ba51fa9fb137aaf1eac2e7"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-GTTableModule-1ebe86bc97aa2367165e0ca42a31d9ba65b460525e2c5920ddc83f3a72bb25f6e9ae3f6824d2992e1746b91a8397efe4462742c7c1ba51fa9fb137aaf1eac2e7"' :
                                        'id="xs-directives-links-module-GTTableModule-1ebe86bc97aa2367165e0ca42a31d9ba65b460525e2c5920ddc83f3a72bb25f6e9ae3f6824d2992e1746b91a8397efe4462742c7c1ba51fa9fb137aaf1eac2e7"' }>
                                        <li class="link">
                                            <a href="directives/GTConversionDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GTConversionDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/GTAccionTablaComponent.html" data-type="entity-link" >GTAccionTablaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GTBuscadorComponent.html" data-type="entity-link" >GTBuscadorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GTElementoTablaComponent.html" data-type="entity-link" >GTElementoTablaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GTTablaComponent.html" data-type="entity-link" >GTTablaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GTTablaInfinitaComponent.html" data-type="entity-link" >GTTablaInfinitaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GTTablaMaestra.html" data-type="entity-link" >GTTablaMaestra</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/GTAccion.html" data-type="entity-link" >GTAccion</a>
                            </li>
                            <li class="link">
                                <a href="classes/GTAccionCondicion.html" data-type="entity-link" >GTAccionCondicion</a>
                            </li>
                            <li class="link">
                                <a href="classes/GTForm.html" data-type="entity-link" >GTForm</a>
                            </li>
                            <li class="link">
                                <a href="classes/GTFormatosTabla.html" data-type="entity-link" >GTFormatosTabla</a>
                            </li>
                            <li class="link">
                                <a href="classes/GTFormElement.html" data-type="entity-link" >GTFormElement</a>
                            </li>
                            <li class="link">
                                <a href="classes/GTObjetoTabla.html" data-type="entity-link" >GTObjetoTabla</a>
                            </li>
                            <li class="link">
                                <a href="classes/GTPeticionExpansion.html" data-type="entity-link" >GTPeticionExpansion</a>
                            </li>
                            <li class="link">
                                <a href="classes/GTPeticionPaginacion.html" data-type="entity-link" >GTPeticionPaginacion</a>
                            </li>
                            <li class="link">
                                <a href="classes/GTSelectMaestroTabla.html" data-type="entity-link" >GTSelectMaestroTabla</a>
                            </li>
                            <li class="link">
                                <a href="classes/GTVagon.html" data-type="entity-link" >GTVagon</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/GTFormService.html" data-type="entity-link" >GTFormService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SharedService.html" data-type="entity-link" >SharedService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/GTCriterioOrdenacion.html" data-type="entity-link" >GTCriterioOrdenacion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GTPagina.html" data-type="entity-link" >GTPagina</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});