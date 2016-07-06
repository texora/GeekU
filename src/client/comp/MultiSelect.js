/**
 * Material UI multi select
 *
 * Use with: 
 * <MultiSelect fullWidth={true} value={this.state.values} onChange={(e,v) => this.setState({values: v})}>
 * 		<ListItem primaryText={"Option 1"} value={1} />
 * 		<ListItem primaryText={"Option 2"} value={2} />
 * 		<ListItem primaryText={"Option 3"} value={3} />
 * 		<ListItem primaryText={"Option 4"} value={4} />
 * </MultiSelect>
 * 
 * this.state.values is an array of the values which are currently selected.
 *
 * KJB: - Currently NOT used (A BIT HOAKY, and ONLY PARTIALLY OPERATIONAL)
 *      - Taken from:
 *        ... https://github.com/callemall/material-ui/issues/1956
 *        ... https://gist.github.com/kkoch986/34a43b79acd460cae527496a5fa6a982
 *      - May work better with SelectField's original MenuItem and nix the TextField
 *      - My usage attempt:
 *         <MultiSelect floatingLabelText="Fields:"
 *                      fullWidth={true}
 *                      value={selCrit.fields}
 *                      onChange={(e,v) => fieldsChangeFn(v)}>
 *         	<ListItem primaryText={'Student Number'}  value={'studentNum'} />
 *         	<ListItem primaryText={'Gender'}          value={'gender'} />
 *         	<ListItem primaryText={'First Name'}      value={'firstName'} />
 *         	<ListItem primaryText={'Last Name'}       value={'lastName'} />
 *         	<ListItem primaryText={'Birthday'}        value={'birthday'} />
 *         	<ListItem primaryText={'Phone'}           value={'phone'} />
 *         	<ListItem primaryText={'Email'}           value={'email'} />
 *         	<ListItem primaryText={'Address'}         value={'addr'} />
 *         	<ListItem primaryText={'From (State)'}    value={'addr.state'} />
 *         	<ListItem primaryText={'GPA'}             value={'gpa'} />
 *         	<ListItem primaryText={'Graduation Term'} value={'graduation'} />
 *         	<ListItem primaryText={'Degree'}          value={'degree'} />
 *         </MultiSelect>
 **/

import React from 'react';
import SelectField from 'material-ui/lib/select-field';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Checkbox from 'material-ui/lib/checkbox';

class MultiSelect extends SelectField {
	render() {
		const styles = this.getStyles();
		const {
			autoWidth,
			children,
			style,
			labelStyle,
			iconStyle,
			underlineDisabledStyle,
			underlineFocusStyle,
			underlineStyle,
			errorStyle,
			selectFieldRoot,
			disabled,
			floatingLabelText,
			floatingLabelStyle,
			hintStyle,
			hintText,
			fullWidth,
			errorText,
			onFocus,
			onBlur,
			onChange,
			value,
      ...other
		} = this.props;

		let labels = [];
		for(let i in children) {
			if(value.indexOf(children[i].props.value) >= 0) {
				labels.push(children[i].props.primaryText);
			}
		}

		if(labels.length === 0) {
			labels.push("None");
		}

		return (
			<TextField
				  style={style}
				  floatingLabelText={floatingLabelText}
				  floatingLabelStyle={floatingLabelStyle}
				  hintStyle={hintStyle}
				  hintText={(!hintText && !floatingLabelText) ? ' ' : hintText}
				  fullWidth={fullWidth}
				  errorText={errorText}
				  underlineStyle={underlineStyle}
				  errorStyle={errorStyle}
				  onFocus={onFocus}
				  onBlur={onBlur}
				  underlineDisabledStyle={underlineDisabledStyle}
				  underlineFocusStyle={underlineFocusStyle}
			>
				<div style={{width: "100%"}}>
					<div style={{position:"absolute", bottom: 12, left:0, width: "100%", overflow:"hidden" }}>{labels.join(", ")}</div>
					<DropDownMenu
						  disabled={disabled}
						  style={{width:"100%"}}
						  labelStyle={this.mergeStyles(styles.label, labelStyle)}
						  iconStyle={this.mergeStyles(styles.icon, iconStyle)}
						  underlineStyle={styles.hideDropDownUnderline}
						  autoWidth={autoWidth}
						  {...other}
					>
						{children.map(item => {
							 let checkbox = <Checkbox 
			                	          checked={(value || []).indexOf(item.props.value) >= 0} 
			                	          onCheck={(e,v) => { 
			                		            const index = value.indexOf(item.props.value);
			                		            if(v === true) {
			                			            if(index < 0) {
			                				            value.push(item.props.value);
			                				            if(this.props.onChange) this.props.onChange(e, value);
			                			            }
			                		            } else {
			                			            if(index >= 0) {
			                				            value.splice(index, 1);
			                				            if(this.props.onChange) this.props.onChange(e, value);
			                			            }
			                		            }
			                	            }} />;
							 return React.cloneElement(item, {
				         leftCheckbox: checkbox,
                 key: item.props.value // KJB: added this new to prevent React from complaining
				       });
						 })}
					</DropDownMenu>
				</div>
			</TextField>
		);
	}
}

export default MultiSelect;
