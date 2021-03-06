/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

// Very simple plugin for adding a close context menu to tabs

Ext.ux.TabCloseMenu = Ext.extend(Object, {
    /**
     * @cfg {String} closeTabText
     * The text for closing the current tab. Defaults to <tt>'Close Tab'</tt>.
     */
    closeTabText: 'Close Tab',

    /**
     * @cfg {String} closeOtherTabsText
     * The text for closing all tabs except the current one. Defaults to <tt>'Close Other Tabs'</tt>.
     */
    closeOtherTabsText: 'Close Other Tabs',
    
    /**
     * @cfg {Boolean} showCloseAll
     * Indicates whether to show the 'Close All' option. Defaults to <tt>true</tt>. 
     */
    showCloseAll: true,

    /**
     * @cfg {String} closeAllTabsText
     * <p>The text for closing all tabs. Defaults to <tt>'Close All Tabs'</tt>.
     */
    closeAllTabsText: 'Close All Tabs',
    
    constructor : function (config) {
        Ext.apply(this, config || {});
    },

    //public
    init : function (tabs) {
        this.tabs = tabs;
        tabs.on({
            scope       : this,
            contextmenu : this.onContextMenu,
            destroy     : this.destroy
        });
    },
    
    destroy : function () {
        Ext.destroy(this.menu);
        delete this.menu;
        delete this.tabs;
        delete this.active;    
    },

    // private
    onContextMenu : function (tabs, item, e) {
        this.active = item;
        var m = this.createMenu(),
            disableAll = true,
            disableOthers = true,
            closeAll = m.getComponent('closeall');
        
        m.getComponent('close').setDisabled(!item.closable);
        tabs.items.each(function () {
            if (this.closable) {
                disableAll = false;
                if (this != item) {
                    disableOthers = false;
                    return false;
                }
            }
        });
        m.getComponent('closeothers').setDisabled(disableOthers);
        if (closeAll) {
            closeAll.setDisabled(disableAll);
        }
        
        e.stopEvent();
        m.showAt(e.getPoint());
    },
    
    createMenu : function () {
        if (!this.menu) {
            var items = [{
                itemId: 'close',
                text: this.closeTabText,
                iconCls: this.closeTabIconCls,
                scope: this,
                handler: this.onClose
            }];
            if (this.showCloseAll) {
                items.push('-');
            }
            items.push({
                itemId: 'closeothers',
                text: this.closeOtherTabsText,
                iconCls: this.closeOtherTabsIconCls,
                scope: this,
                handler: this.onCloseOthers
            });
            if (this.showCloseAll) {
                items.push({
                    itemId: 'closeall',
                    text: this.closeAllTabsText,
                    iconCls: this.closeAllTabsIconCls,
                    scope: this,
                    handler: this.onCloseAll
                });
            }
            this.menu = new Ext.menu.Menu({
                items: items
            });
        }
        return this.menu;
    },
    
    onClose : function () {
        this.tabs.closeTab(this.active);
    },
    
    onCloseOthers : function () {
        this.doClose(true);
    },
    
    onCloseAll : function () {
        this.doClose(false);
    },
    
    doClose : function (excludeActive) {
        var items = [];
        this.tabs.items.each(function (item) {
            if (item.closable) {
                if (!excludeActive || item != this.active) {
                    items.push(item);
                }    
            }
        }, this);
        Ext.each(items, function (item) {
            this.tabs.closeTab(item);
        }, this);
    }
});

if (typeof Sys!=="undefined") {Sys.Application.notifyScriptLoaded();}
