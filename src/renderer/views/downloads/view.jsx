import React from 'react'
import * as icons from '@/constants/icons'
import Icon from '@mdi/react'
import Loader from '@/components/common/loader'
import EmptyState from '@/components/common/emptyState'
import TrackList from '@/components/trackList'
import Lbry from '@/utils/lbry'

class View extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      fetchingData: true,
      downloads: [],
    }
  }

  componentDidMount() {
    const { cache, downloads } = this.props
    const uris = Object.keys(downloads)
    // List is empty
    if (uris.length === 0) {
      // Stop loading data
      this.setState({ fetchingData: false })
    } else {
      // Resolve uris
      Lbry.resolve({ uris })
        .then(res => {
          // Remove unresolved claims
          const list = Object.entries(res).filter(([key, value]) => !value.error)
          // Update state
          this.setState({
            fetchingData: false,
          })
        })
        // Handle errors
        .catch(err => {
          this.setState({ fetchingData: false })
        })
    }
  }

  render() {
    const { downloads } = this.props
    const { fetchingData } = this.state
    const uris = Object.keys(downloads)

    const content =
      uris.length > 0 ? (
        // Render list
        <TrackList list={uris} name={'downloads'} />
      ) : (
        // List is empty
        <EmptyState
          title="No downloads"
          message={
            <p>
              <span>{'Press'}</span>
              <span>
                <Icon className="icon icon--small-x" path={icons.PLAY} />
              </span>
              <span>{'to download a track'}</span>
            </p>
          }
        />
      )

    return (
      <div className="page">
        {!fetchingData ? (
          content
        ) : (
          <Loader icon={icons.DOWNLOAD_OUTLINE} animation="pulse" />
        )}
      </div>
    )
  }
}

export default View