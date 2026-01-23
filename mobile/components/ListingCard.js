import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
  AccessibilityInfo,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

/**
 * ListingCard
 *
 * Props:
 * - images: array of image URLs or objects ({ url } or { path }).
 * - hasVideo: boolean (true if there's a video)
 * - hasVirtualTour: boolean (true if there's a virtual tour)
 * - priceRange: string (e.g. "2,150 – 8,699")
 * - bedroomRange: string (e.g. "Studio – 3 Beds")
 * - title: string
 * - address: string (full address: street, area, city)
 * - amenities: array of strings
 * - showAmenities: boolean (whether to render amenities below address). Default: false
 * - phoneEnabled: boolean (owner allowed phone contact)
 * - contactPhone: string (owner phone number) — used only if phoneEnabled true
 * - saved: boolean (is saved by current user) — controls heart state
 * - onSave: fn called when user taps save
 * - onUnsave: fn called when user taps unsave
 * - onMessage: fn called when user taps Message
 * - onCall: fn called when user taps Call
 * - isOwnerMode: boolean (true when rendering on owner dashboard)
 * - onEdit: fn owner action
 * - onDeactivate: fn owner action
 * - style: optional style overrides
 *
 * Behavior:
 * - shows nothing for fields that are missing (no placeholder/fake data)
 * - images load from provided URLs; if images is empty/undefined the image area is omitted
 *
 * Responsive:
 * - adapts height based on screen width
 */

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_HORIZONTAL_PADDING = 16
const CARD_WIDTH = Math.min(1000, SCREEN_WIDTH - CARD_HORIZONTAL_PADDING * 2)
// Slightly taller image to mimic modern listing apps (approx 3:2)
const IMAGE_HEIGHT = Math.round(CARD_WIDTH * 0.66)

export default function ListingCard({
  images,
  hasVideo,
  hasVirtualTour,
  priceRange,
  bedroomRange,
  title,
  address,
  amenities,
  phoneEnabled,
  contactPhone,
  saved=null,
  onSave=null,
  onUnsave=null,
  onMessage=null,
  onCall=null,
  onPress,
  isOwnerMode = false,
  onEdit,
  onDeactivate,
  onDelete,
  verificationStatus,
  rejectionReason,
  style,
  showAmenities = false,
}) {
  // Normalize images to an array of URL strings (if image objects are provided)
  const normalizedImages = Array.isArray(images)
    ? images
        .map((img) => {
          if (!img) return null
          if (typeof img === 'string') return img
          // prefer url, then path
          return img.url || (img.path ? normalizeStoragePath(img.path) : null)
        })
        .filter(Boolean)
    : []

  const [index, setIndex] = useState(0)
  const flatRef = useRef(null)

  useEffect(() => {
    // when images change, reset index
    setIndex(0)
  }, [images])

  function normalizeStoragePath(path) {
    // If backend returns a storage path like "apartments/xxx.jpg", construct a URL
    // NOTE: caller should pass full URLs when possible. If path is returned, derive
    // using expo env variable or API base. Do not invent base on behalf of user if not available.
    // Here we just return the path (consumer may provide full url).
    return path
  }

  const goPrev = () => {
    if (normalizedImages.length === 0) return
    const next = Math.max(0, index - 1)
    setIndex(next)
    flatRef.current?.scrollToIndex({ index: next, animated: true })
  }

  const goNext = () => {
    if (normalizedImages.length === 0) return
    const next = Math.min(normalizedImages.length - 1, index + 1)
    setIndex(next)
    flatRef.current?.scrollToIndex({ index: next, animated: true })
  }

  const handleSaveToggle = () => {
    if (saved) {
      onUnsave && onUnsave()
    } else {
      onSave && onSave()
    }
  }

  const renderImageItem = ({ item }) => {
    // item expected to be a URL string
    if (!item) return null
    // If the backend supplies relative paths, the parent should have converted to absolute URLs.
    return (
      <Image
        source={{ uri: item }}
        style={styles.image}
        resizeMode="cover"
        accessible
        accessibilityLabel={title ? `${title} image` : 'Listing image'}
      />
    )
  }

  const amenitiesText =
    Array.isArray(amenities) && amenities.length > 0 ? amenities.join(', ') : null

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      {/* Absolute badge sits on top-left of the card (over image when present) */}
      {isOwnerMode && (
        <View style={styles.badgeAbsoluteContainer} pointerEvents="none">
          {verificationStatus === 'approved' ? (
            <View style={[styles.statusBadge, styles.statusBadgeVerified]}>
              <Text style={styles.statusBadgeText}>Verified</Text>
            </View>
          ) : verificationStatus === 'rejected' ? (
            <View style={[styles.statusBadge, styles.statusBadgeRejected]}>
              <Text style={styles.statusBadgeText}>Rejected</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.statusBadgePending]}>
              <Text style={styles.statusBadgeText}>Pending Verification</Text>
            </View>
          )}
        </View>
      )}
      {/* Image carousel (only render if owner provided images) */}
      {normalizedImages.length > 0 && (
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatRef}
            data={normalizedImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderImageItem}
            onMomentumScrollEnd={(ev) => {
              const viewSize = ev.nativeEvent.layoutMeasurement.width
              const contentOffset = ev.nativeEvent.contentOffset.x
              const newIndex = Math.floor(contentOffset / viewSize)
              setIndex(newIndex)
            }}
            initialScrollIndex={index}
            getItemLayout={(_, i) => ({ length: CARD_WIDTH, offset: CARD_WIDTH * i, index: i })}
            style={{ width: CARD_WIDTH }}
          />

          {/* Left / Right arrows */}
          {normalizedImages.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.arrowBtn, styles.leftArrow]}
                onPress={goPrev}
                accessibilityRole="button"
                accessibilityLabel="Previous image"
              >
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.arrowBtn, styles.rightArrow]}
                onPress={goNext}
                accessibilityRole="button"
                accessibilityLabel="Next image"
              >
                <Ionicons name="chevron-forward" size={22} color="#fff" />
              </TouchableOpacity>

              {/* pagination dots */}
              <View style={styles.pagination}>
                {normalizedImages.map((_, i) => (
                  <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                ))}
              </View>
            </>
          )}

          {/* Overlay: Videos | Virtual Tours */}
          {(hasVideo || hasVirtualTour) && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>
                {hasVideo && 'Video'}
                {hasVideo && hasVirtualTour ? '  |  ' : ''}
                {hasVirtualTour && 'Virtual Tour'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Content area */}
      <View style={styles.body}>
        {/* (Badge moved to absolute overlay on top-left) */}
        {/* top row: price + save (if not owner) */}
        <View style={styles.topRow}>
          {/* bedroom / title */}
          <View style={styles.titleRow}>
            {title ? <Text style={styles.titleText} numberOfLines={2}>{title}</Text> : null}
            {bedroomRange ? <Text style={styles.bedroomText}>{bedroomRange}</Text> : null}
          </View>
          {priceRange ? <Text style={styles.priceText}>{priceRange}</Text> : null}

          {!isOwnerMode && (onSave || onUnsave) && saved && (
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveToggle}
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Unsave listing' : 'Save listing'}
            >
              <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#e0245e' : '#333'} />
            </TouchableOpacity>
          )}
        </View>

        

        {/* address */}
  {address ? <Text style={styles.addressText} numberOfLines={2}>{address}</Text> : null}

    {/* amenities (optional) */}
  {showAmenities && amenitiesText ? <Text style={styles.amenitiesText} numberOfLines={2}>{amenitiesText}</Text> : null}

        {/* actions row */}
        <View style={styles.actionsRow}>
          {/* If both message and call are available, show two equal-width primary buttons */}
          {onMessage && contactPhone && onCall && (
            <>
              <TouchableOpacity style={[styles.primaryBtn, styles.splitBtn, { marginRight: 8 }]} onPress={onMessage} accessibilityRole="button" accessibilityLabel="Message">
                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, styles.splitBtn]} onPress={() => onCall(contactPhone)} accessibilityRole="button" accessibilityLabel={`Call ${contactPhone}`}>
                <Ionicons name="call-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Call</Text>
              </TouchableOpacity>
            </>
          ) }

          {/* Owner-only actions */}
          {isOwnerMode && (
            <View style={styles.ownerActions}>
              {onEdit ? (
                <TouchableOpacity style={styles.ownerBtn} onPress={onEdit}>
                  <Text style={styles.ownerBtnText}>Edit</Text>
                </TouchableOpacity>
              ) : null}
              {onDeactivate ? (
                <TouchableOpacity style={[styles.ownerBtn, { backgroundColor: '#f5f5f5' }]} onPress={onDeactivate}>
                  <Text style={[styles.ownerBtnText, { color: '#333' }]}>Deactivate</Text>
                </TouchableOpacity>
              ) : null}
              {onDelete ? (
                <TouchableOpacity style={[styles.ownerBtn, { backgroundColor: '#ffecec' }]} onPress={onDelete}>
                  <Text style={[styles.ownerBtnText, { color: '#b91c1c' }]}>Delete</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderColor: '#e6e6e6',
    borderWidth: 1,
    marginBottom: 16,
    alignSelf: 'center',
    // shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
      },
    }),
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: '#f2f2f2',
    position: 'relative',
  },
  image: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  pagination: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
  },
  overlay: {
    position: 'absolute',
    left: 12,
    top: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
  },
  overlayText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  body: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginTop: 20
  },
  saveBtn: {
    padding: 6,
    marginLeft: 12,
  },
  titleRow: {
    marginTop: 8,
    marginBottom: 6,
  },
  bedroomText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeAbsoluteContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 40,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  statusBadgeVerified: {
    backgroundColor: '#10b981',
  },
  statusBadgePending: {
    backgroundColor: '#f59e0b',
  },
  statusBadgeRejected: {
    backgroundColor: '#ef4444',
  },
  rejectionText: {
    color: '#b91c1c',
    fontSize: 12,
    flex: 1,
  },
  addressText: {
    marginTop: 6,
    color: '#666',
    fontSize: 14,
  },
  amenitiesText: {
    marginTop: 8,
    color: '#666',
    fontSize: 13,
  },
  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  primaryBtn: {
    backgroundColor: '#1778f2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e6f0ff',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
  },
  callBtnText: {
    color: '#1778f2',
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  secondaryBtnText: {
    color: '#111',
    fontWeight: '700',
  },
  ownerActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  ownerBtn: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  ownerBtnText: {
    color: '#1778f2',
    fontWeight: '700',
  },
  splitBtn: {
    flex: 1,
  },
})