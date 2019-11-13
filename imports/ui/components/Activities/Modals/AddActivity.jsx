import React, {useEffect} from "react";
import moment from 'moment';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import MenuItem from '@material-ui/core/MenuItem';
import 'date-fns';
import Tooltip from '@material-ui/core/Tooltip';
import SVGInline from "react-svg-inline";
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import {withTracker} from "meteor/react-meteor-data";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { data } from "/imports/activitiesContent.json";
import SvgIcon from '@material-ui/core/SvgIcon';
import SVG from 'react-inlinesvg';
import SelectStakeHolders from './SelectStakeHolders';
import { Peoples } from '/imports/api/peoples/peoples'
import { Companies } from '/imports/api/companies/companies'
import { stringHelpers } from '/imports/helpers/stringHelpers';
import  AutoComplete from '/imports/ui/components/utilityComponents/AutoCompleteInline'
import AddNewPerson from './AddNewPerson';
import { withRouter } from 'react-router'
import DeleteActivity from './DeleteActivity';

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(3, 3),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const gridStyles = makeStyles(theme => ({
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        '&:hover': {
            background: '#dae0e5;'
        },
        '&:selected': {
            background: '#dae0e5;'
        }
        // background: 'black'
    },
    item: {
        // background: '#dae0e5'
    }
}));
const styles2 = {
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        '&:hover': {
            background: '#dae0e5;'
        },
        '&:selected': {
            // background: '#dae0e5;'
        }
        // background: 'black'
    },
    item: {
        // background: '#dae0e5'
    }
};

const classes3 = withStyles(styles2);


const useStyles = makeStyles(theme => ({
    AddNewActivity: {
        flex: 1,
        // marginTop: 2,
        // marginLeft: 15
    },
    button: {
        background: '#f1753e',
        color: 'white',
        '&:hover': {
            background: '#f1753e',
            color: 'white'
        }
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    gridText: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary,
    },
    avatar: {
        position: 'absolute',
        top: theme.spacing(1),
        left: theme.spacing(1),
        width: 15,
        height: 15
    },
    panelSummary: {
        background: 'red',
        root: {
            background: 'red'
        }
    }
}));

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

function createData(name, calories, fat, carbs, protein) {
    return { _id: name, calories, fat, carbs, protein };
}

const rows = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0),
];

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

function AddActivity(props) {
    let { company, stakeHolders, local, match, edit, activity } = props;
    const [open, setOpen] = React.useState(edit || false);
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [isNew, setIsNew] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [person, setPerson] = React.useState('');
    const [activityType, setActivityType] = React.useState({});
    const [startingDate, setStartingDate] = React.useState(new Date());
    const [dueDate, setDueDate] = React.useState(new Date());
    const [startingDateOpen, setStartingDateOpen] = React.useState(false);
    const [endingDate, setEndingDate] = React.useState(new Date());
    const [endingDateOpen, setEndingDateOpen] = React.useState(false);
    const [selectOpen, setSelectOpen] = React.useState(false);
    const [role, setRole] = React.useState('changeManager');
    const [expanded, setExpanded] = React.useState('panel1');

    let { projectId } = match.params;
    const classes = useStyles();
    const classes1 = gridStyles();

    const updateValues = () => {
        if(isNew){
            resetValues();
            return false;
        }
        let selectedActivity = data.find(item => item.name === activity.type) || {};
        setActivityType(selectedActivity);
        setDueDate(activity.dueDate);
        setDescription(activity.description);
        let obj = {
            label: `${activity.personResponsible.profile.firstName} ${activity.personResponsible.profile.lastName}`,
            value: activity.personResponsible._id
        };
        setPerson(obj);
        if(local.ids.length !== activity.stakeHolders.length){
            activity.stakeHolders && (updateFilter('localStakeHolders', 'ids', activity.stakeHolders))
        }

    };

    const resetValues = () => {
        let selectedActivity = data.find(item => item.name === activity.type) || {};
        setActivityType({});
        setDueDate(new Date());
        setDescription('');
        setPerson(null)
    };

    const updateUsersList = () => {
        Meteor.call(`users.getPersons`, {company: company}, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'});
            }
            if(res && res.length){
                setUsers(res.map(user => {
                    return {
                        label: `${user.profile.firstName} ${user.profile.lastName}`,
                        value: user._id
                    }
                }))
            }
            else {
                setUsers([])
            }
        })
    };

    useEffect(() => {
        setOpen(edit || open);
        updateUsersList();
        if(edit && activity && activity.name){
            setExpanded('panel1');
            updateValues();
        }


    }, [props.company, stakeHolders, company, props.edit, props.activity, isNew]);

    const handleChangePanel = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClickOpen = () => {
        setIsNew(true);
        // updateFilter('localStakeHolders', 'ids', [])
        setExpanded('panel1');
        setOpen(true);
    };
    const handleClose = () => {
        setName('');
        setOpen(false);
        setIsNew(false);
        props.newActivity();
        resetValues()
    };
    const createProject = (e) => {
        e.preventDefault();
        // else if(endingDate < startingDate){
        //     props.enqueueSnackbar('Please fix the date error', {variant: 'error'});
        //     return false;
        // }
        if(!(description && person && dueDate)){
            props.enqueueSnackbar('Please fill all required Fields', {variant: 'error'});
            return false;
        }
        else if(!(activityType && activityType.name) && Array.isArray(stakeHolders)){
            props.enqueueSnackbar('Please fill all required Fields', {variant: 'error'});
            return false;
        }
        let params = {
            activity: {
                name: activityType.buttonText,
                type: activityType.name,
                description,
                owner: person.value,
                dueDate,
                stakeHolders: local.ids,
                projectId,
                step: 1
            }
        };

        let methodName = isNew ? 'activities.insert' : 'activities.update';
        !isNew && (params.activity._id = activity._id);
        Meteor.call(methodName, params, (err, res) => {
            if(err){
                props.enqueueSnackbar(err.reason, {variant: 'error'})
            }
            else{
                // updateFilter('localStakeHolders', 'ids', [])
                handleClose();
                props.enqueueSnackbar(`Activity ${isNew ? 'Added' : 'Updated'} Successfully.`, {variant: 'success'})
            }

        })

    };

    const handleStartingDate = date => {
        setStartingDate(date);
        setStartingDateOpen(false)
    };

    const handleDueDate = date => {
        setDueDate(date)
    };

    const handleEndingDate = date => {
        if(!(endingDate < startingDate)){
            setEndingDateOpen(false)
        }
        setEndingDate(date);

    };

    const openStarting = (e) => {
        setStartingDateOpen(true)
    };

    const openEnding = (e) => {
        setEndingDateOpen(true)
    };

    const handleChange = (e) => {
        setName(e.target.value)
    };

    const handleChangePerson = (e) => {
        setPerson(e.target.value)
    };

    const updateUsers = (value) => {
        setPerson(value)
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    };

    const onSubmit = (event) => {
        event.preventDefault()
    };

    function handleSelectChange(event) {
        setRole(event.target.value);
    }

    function handleSelectClose() {
        setSelectOpen(false);
    }

    function handleSelectOpen() {
        setSelectOpen(true);
    }

    function deleteActivity() {
        setDeleteModal(true);
    }

    function deleteActivityClose(deleted) {
        setDeleteModal(false);
        deleted === true && handleClose();
    }



    return (
        <div className={classes.AddNewActivity}>
            <Button variant="contained" className={classes.button} fullWidth={true} onClick={handleClickOpen}>
                Add Activity
            </Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    { isNew ? 'Add' : 'Edit' } Activity
                </DialogTitle>
                <form onSubmit={createProject} noValidate>
                <DialogContent dividers>
                    <div className={classes.root}>
                        <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChangePanel('panel1')}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography className={classes.heading}>Date</Typography>
                                <Typography className={classes.secondaryHeading}>Due Date: {moment(dueDate).format('DD-MMM-YY')}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-between" spacing={4}>
                                        <Grid item xs={6}>
                                            <KeyboardDatePicker
                                                fullWidth
                                                disableToolbar
                                                variant="inline"
                                                format="MM/dd/yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="Due Date"
                                                value={dueDate}
                                                autoOk={true}
                                                onChange={handleDueDate}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                fullWidth
                                                variant="inline"
                                                // open={true}
                                                margin="normal"
                                                id="date-picker-dialog"
                                                label="Date Completed"
                                                format="MM/dd/yyyy"
                                                value={null}
                                                // minDate={startingDate}
                                                open={endingDateOpen}
                                                onOpen={openEnding}
                                                onChange={handleEndingDate}
                                                disabled={true}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChangePanel('panel2')}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography className={classes.heading}>Activity Type</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    {activityType.buttonText || 'Select Activity type'}
                                    {activityType.iconSVG ? <SVGInline
                                        style={{position: 'absolute', marginTop: -8}}
                                        width="35px"
                                        height="35px"
                                        fill='#f1753e'
                                        svg={activityType.iconSVG}
                                    /> : ''
                                    }
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container justify="space-between" spacing={4}>
                                {
                                    data.map((item, index) => {
                                        return <Tooltip title={item.helpText} key={index}>
                                        <Grid item={true} xs={3} classes={classes1} style={{background : activityType.name === item.name ? '#dae0e5' : '' }} onClick={(e) => { setActivityType(item); }}>

                                        <SVGInline
                                            width="35px"
                                            height="35px"
                                            fill='#f1753e'
                                            svg={item.iconSVG}
                                        />
                                            <Typography className={classes.gridText}>
                                                {item.buttonText}
                                            </Typography>
                                        </Grid>
                                        </Tooltip>
                                    })
                                }
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChangePanel('panel3')}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3bh-content"
                                id="panel3bh-header"
                            >
                                <Typography className={classes.heading}>Stakeholders</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    {local.ids.length} of {stakeHolders.length}
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container justify="center">
                                    <SelectStakeHolders rows={stakeHolders} local={local}/>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel expanded={expanded === 'panel4'} onChange={handleChangePanel('panel4')}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel4bh-content"
                                id="panel4bh-header"
                            >
                                <Typography className={classes.heading}>Description</Typography>
                                <Typography className={classes.secondaryHeading}>{
                                    stringHelpers.limitCharacters(description, 36) || 'Add Notes or Instructions for the person responsible'
                                }</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="description"
                                    label="Description"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    required={true}
                                    type="text"
                                    fullWidth
                                />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel expanded={expanded === 'panal5'} onChange={handleChangePanel('panal5')}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panal5bh-content"
                                id="panal5bh-header"
                            >
                                <Typography className={classes.heading}>Person Responsible</Typography>
                                <Typography className={classes.secondaryHeading}>Assign Activity Owner</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container justify="space-between" spacing={2}>
                                {/*<TextField*/}
                                    {/*autoFocus*/}
                                    {/*margin="dense"*/}
                                    {/*id="name"*/}
                                    {/*label="Person Responsible"*/}
                                    {/*value={person}*/}
                                    {/*onChange={handleChangePerson}*/}
                                    {/*required={true}*/}
                                    {/*type="text"*/}
                                    {/*fullWidth*/}
                                {/*/>*/}
                                    <Grid item={true} xs={7}>
                                        <AutoComplete updateUsers={updateUsers} data={users} selectedValue={person}/>
                                    </Grid>
                                    <Grid item={true} xs={5}>
                                        <AddNewPerson company={company}/>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
                </DialogContent>
                    <DialogActions>
                        {isNew ? <Button onClick={handleClose} color="secondary">
                            cancel
                        </Button> :
                            <Button onClick={deleteActivity} color="secondary">
                                Delete
                            </Button>}

                        <Button type="submit" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <DeleteActivity open={deleteModal} handleModalClose={deleteActivityClose} activity={activity}/>
        </div>
    );
}

const AddActivityPage = withTracker(props => {
    let local = LocalCollection.findOne({
        name: 'localStakeHolders'
    });
    Meteor.subscribe('companies');
    let company = Companies.findOne() || {};
    let companyId = company._id || {};
    Meteor.subscribe('peoples', companyId );
    return {
        stakeHolders: Peoples.find().fetch(),
        local,
        company
    };
})(withRouter(AddActivity));

export default withSnackbar(AddActivityPage)