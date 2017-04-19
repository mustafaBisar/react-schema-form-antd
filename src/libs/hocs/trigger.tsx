import * as React from 'react';

import { SchemaFormBase } from '../base';
import { utils } from '../../utils';
import { HocBase } from './base';

/**
 * 包装Template的组件HOC
 * @param Component 需要包装的组件
 * @param options   参数
 */
export const TriggerHoc = (Component: any): React.ComponentClass<any> => {
    return class Hoc extends HocBase<any, any> {
        private timeId: number;

        constructor(props, content) {
            super(props, content);
        }

        handleTrigger(value) {
            const { uiSchema, arrayIndex, formEvent } = this.props;
            const keys = utils.mergeKeys({ uiSchema, arrayIndex });
            const { text = undefined } = this.state || {};
            let { prop = "", trigger = null } = uiSchema["ui:trigger"]

            if (value != text && value != this.getFieldValue() && trigger) {
                this.timeId && clearTimeout(this.timeId);
                this.timeId = setTimeout(() => {
                    formEvent.emit(["triggerEvent"].concat(keys), {
                        loading: true
                    });
                    trigger(value).then((dataSource) => {
                        formEvent.emit(["triggerEvent"].concat(keys), {
                            dataSource: dataSource,
                            // text: value,
                            loading: false
                        });
                    });
                }, 300);

                return true;
            }

            return false;
        }

        render() {
            const { uiSchema, arrayIndex } = this.props;
            let { prop = "", trigger = null } = uiSchema["ui:trigger"] || {}, props = {};

            if (prop && trigger) {
                props[prop] = this.handleTrigger.bind(this);
            }

            return <Component  {...this.props} triggerProps={props}></Component>;
        }
    }
}