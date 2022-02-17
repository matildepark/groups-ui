import React, { useEffect, useState } from 'react'
import {
    Button,
    IconButton,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow, TextField,
    useTheme,
    withStyles
} from '@material-ui/core'
import { ArrowBack, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import { observer } from 'mobx-react-lite'
import { useStyles } from './admin-view'
import PropTypes from 'prop-types'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Page } from '../page'
import { useStores } from '../../shared-state/repo'
import { Routes } from '../../routes'
import { GroupMember } from '../../generated/regen/group/v1alpha1/types'
import { toUint8Array } from '../../shared-state/groups-store'

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5)
    }
}))

function TablePaginationActions(props) {
    const classes = useStyles1()
    const theme = useTheme()
    const { count, page, rowsPerPage, onPageChange } = props

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1)
    }

    return (
        <div className={classes.root}>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
        </div>
    )
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
}

const StyledTableCell = withStyles(() => ({
    head: {
        padding: '23px 40px',
        fontSize: '12px',
        fontWeight: 800,
        textTransform: 'uppercase',
        fontFamily: ' \'Mulish\', sans-serif '
    },
    body: {
        padding: '48px 40px',
        fontSize: '16px'
    }
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
    root: {
        textAlign: 'left',
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover
        }
    }
}))(TableRow)

const tableStyles = makeStyles({
    table: {
        borderTop: '1px solid #EFEFEF',
        minWidth: 700
    }
})

export const GroupDetails: React.FC<{}> = observer(() => {
    const { originalEditedGroup, editedGroup, resetEditedGroup, fetchEditedGroupById, updateEditedGroup } = useStores().groupsStore
    // const [membersEditMode, setMembersEditMode] = useState(false)
    const [membersEditMode, setMembersEditMode] = useState(true) // TODO
    const [newMember, setNewMember] = useState('')

    const history = useHistory()

    const classes = useStyles()
    const table = tableStyles()

    const pathParams: any = useParams()
    const groupId = pathParams.id === 'new' ? -1 : Number(pathParams.id)

    useEffect(() => {
        if (!editedGroup) {
            if (groupId === -1) {
                history.push('/groups/new')
            } else {
                (async () => {
                    const group = await fetchEditedGroupById(groupId)
                    if (!group) {
                        history.push(Routes.GROUPS)
                    }
                })()
            }
        }

        return () => {
            resetEditedGroup()
        }
    }, [resetEditedGroup])

    if (!editedGroup) {
        return (
            <Page>
                <div>loading ...</div>
            </Page>
        )
    }

    const originalMembersMap = new Map<string, GroupMember>(originalEditedGroup.members.map(m => [m.member.address, m]))
    const membersMap = new Map<string, GroupMember>(editedGroup.members.map(m => [m.member.address, m]))

    type memberStatus = 'unChanged' | 'changed' | 'newDeleted' | 'newAdded'
    const members: Array<{
        address: string
        weight: number
        status: memberStatus
    }> = []

    editedGroup.members.forEach(m => {
        const status = ((): memberStatus => {
            const original = originalMembersMap.get(m.member.address)
            if (!original) {
                return  'newAdded'
            }

            if (original.member.weight !== m.member.weight) {
                return 'changed'
            }

            return 'unChanged'

        })()
        members.push({
            address: m.member.address,
            weight: Number(m.member.weight),
            status
        })
    })

    originalEditedGroup.members.forEach(m => {
        const member = membersMap.get(m.member.address)
        if (!member) {
            members.push({
                address: m.member.address,
                weight: Number(m.member.weight),
                status: 'newDeleted'
            })
        }
    })

    return (
        <Page>
            <div className={classes.root}>
                <div>
                    <Link to="#" style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 800 }}
                          className={classes.link} onClick={() => console.log('click')}>
                        <ArrowBack style={{ fontSize: '18px', marginRight: '8px' }}/>
                        Foo dev team
                    </Link>
                    <div className={classes.heroBlock}>
                        <h1>Group Details</h1>
                        <Link to={`/groups/${groupId}`}>
                            <Button variant="contained" color="primary" className="btn">
                                edit group
                            </Button>
                        </Link>
                    </div>
                    <div className={classes.heroBlock}>
                        <p className="subtitle">This group is to manage the funds for the Foo developer team’s
                            efforts.</p>
                    </div>
                    <div className={classes.regen}>
                        <p style={{ marginLeft: '0' }}>group admin</p>
                        <p>
                            {editedGroup.info.admin}
                        </p>
                    </div>
                    <br/>
                </div>
                <Paper elevation={2}>
                    <h2 style={{ padding: '40px', fontWeight: 900 }}>Group Policy</h2>
                    <Table className={table.table} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell align="left">voting window</StyledTableCell>
                                <StyledTableCell align="left">threshold</StyledTableCell>
                                <StyledTableCell align="left">quorum</StyledTableCell>
                                <StyledTableCell align="left">admin</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(editedGroup.policy || []).map((p, i) => (
                                <StyledTableRow key={i}>
                                    <StyledTableCell align="left">{'TODO Date'}</StyledTableCell>
                                    <StyledTableCell align="left">{`${p.timeoutInDays} days`}</StyledTableCell>
                                    <StyledTableCell align="left">{p.threshold}</StyledTableCell>
                                    <StyledTableCell align="left">{'TODO no data for quorum'}</StyledTableCell>
                                    <StyledTableCell align="left">{editedGroup.info.admin}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <Paper elevation={2} style={{ marginTop: '21px' }}>
                    <div className={classes.heroBlock}>
                        <h2 style={{ padding: '40px', fontWeight: 900 }}>Members</h2>
                        {membersEditMode ? (
                            <div style={{
                                display: 'flex',
                                paddingRight: '24px'
                            }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={newMember}
                                    onChange={e => setNewMember(e.target.value)}
                                />
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: '16px'
                                }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            updateEditedGroup({
                                                ...editedGroup,
                                                members: [
                                                    ...editedGroup.members,
                                                    {
                                                        group_id: editedGroup.info.group_id,
                                                        member: {
                                                            address: newMember,
                                                            weight: "1",
                                                            metadata: toUint8Array(JSON.stringify({
                                                                name: ''
                                                            }))
                                                        }
                                                    }
                                                ]
                                            })
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        onClick={console.log}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={console.log}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                variant="outlined"
                                color="primary"
                                className="tableBtn"
                                onClick={() => setMembersEditMode(true)}
                            >
                                Edit members
                            </Button>
                        )}
                    </div>
                    <Table className={table.table} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Address</StyledTableCell>
                                <StyledTableCell align="left">voting weight</StyledTableCell>
                                <StyledTableCell align="left">date added</StyledTableCell>
                                <StyledTableCell align="left">status (todo change with buttons and css)</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {members.map((m, i) => {
                                return (
                                    <StyledTableRow key={m.address}>
                                        <StyledTableCell align="left" style={{
                                            width: '15%',
                                            padding: '28px 40px'
                                        }}>{m.address}</StyledTableCell>
                                        <StyledTableCell align="left" style={{
                                            width: '15%',
                                            padding: '28px 40px'
                                        }}>{m.weight}</StyledTableCell>
                                        <StyledTableCell align="left" style={{
                                            width: '30%',
                                            padding: '28px 40px'
                                        }}>{'TODO Date added'}</StyledTableCell>
                                        <StyledTableCell align="left" style={{
                                            width: '30%',
                                            padding: '28px 40px'
                                        }}>{m.status}</StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                {/* <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={memberRows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            /> */}
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Paper>
            </div>
        </Page>
    )
})
